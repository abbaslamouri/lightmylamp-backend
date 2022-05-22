import { Request, Response, NextFunction } from 'express'
import { IUser, User } from '../models/user'

import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
// import sgMail from'@sendgrid/mail'
import crypto from 'crypto'
import { promisify } from 'util'
import AppError from '../utils/AppError'
import asyncHandler from '../utils/asyncHandler'
// import sendEmail from'../utils/Email'

// declare module 'express' {
//   interface Request {
//     user?: IUser
//   }
// }

// declare module 'express' {
//   interface Request {
//     user: any
//   }
// }

const stripe = new Stripe(String(process.env.STRIPE_SK), {
  apiVersion: '2020-08-27',
})

const sendTokenResponse = async (res: Response, statusCode: number, user: IUser) => {
  let token = null
  let auth = null
  if (user) {
    token = await user.getSinedJwtToken()
    auth = { token, user }
  }
  // res.cookie('auth', JSON.stringify(auth), {
  //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   path: '/',
  // })

  res.cookie('jwt', token, {
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    // path: '/',
  })
  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    auth,
  })
}

const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // return next(new AppError(`We can't create user`, 404))
  console.log('RB', req.body)
  // const { user, completeSingupUrl, emailSubject } = req.body
  const { name, email, password } = req.body
  // const { user } = req.body
  // const customer = await stripe.customers.create({ ...user })
  // if (customer) user.stripeCustomerId = customer.id
  // console.log('CUSTOMER', customer)
  const user = await User.create({
    name,
    email,
    password,
  })
  if (!user) return next(new AppError(`We can't create user ${req.body.name}`, 404))
  // const resetToken = await user.createPasswordResetToken()
  await user.save()
  // req.session.user = user
  // console.log('RS', req.session)
  // req.session.user = user
  // user.password = undefined
  // await new sendEmail({
  //   name: user.name,
  //   email: user.email,
  //   emailSubject,
  //   url: `${completeSingupUrl}/?token=${resetToken}`,
  // }).sendCompleteSignup()

  res.status(200).json({
    status: 'success',
    user,
    // message: 'Email sent',
    // token: resetToken,
  })
})

const completeSignup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log('RPT', req.params.token)
  const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) return next(new AppError(`Your registration token is invlaid or has expired`, 400))
  if (user.email !== req.body.email.toLowerCase()) return next(new AppError(`Invalid email`, 400))
  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.active = true
  console.log(user)
  await user.save()
  const url = `${process.env.BASE_URL}`
  // await new Email(user, url).sendWelcome()
  return await sendTokenResponse(res, 200, user)
})

const signin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) return next(new AppError('Email and Password are required', 401))
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Invalid email or password', 401))
  const passwordCheck = await user.checkPassword(password, String(user.password))
  if (!passwordCheck) return next(new AppError('Invalid email or password', 401))
  sendTokenResponse(res, 200, user)
})

const signout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // const auth = { token: ' ', user: {} }
  res.cookie('jwt', '', {
    maxAge: 0,
  })
  res.status(200).json({
    status: 'success',
    data: null,
  })
})

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  }
  if (!token) return next(new AppError('You are not allowed to access these resources, please login', 401))
  if (!process.env.JWT_SECRET) return next(new AppError('We are unable to process your credentials', 401))
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
  const decodedUser = await User.findById(decoded.id)
  if (!decodedUser) return next(new AppError('We cannot find a user with this token in our database', 401))
  if (await decodedUser.hasPasswordChanged(decoded.iat))
    return next(new AppError('User changed password recently, please login again', 401))
  req.user = decodedUser
  next()
})

// const authorize = (...roles:string[]) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user.role))
//       return next(
//         new AppError('You do not have adequate permisson to perform this action', 403, 'inadequate_permission')
//       )
//     next()
//   })

// const isLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
// if (!req.cookies || !req.cookies.jwt) return next()
// const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
// const user = await Model.findById(decoded.id)
// if (!user) return next()
// if (await user.hasPasswordChanged(decoded.iat)) return next()
// res.locals.user = user
// next()
// })

const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, passwordResetUrl, emailSubject } = req.body
  if (!email) return next(new AppError('Please enter a valid email', 404))
  const user = await User.findOne({ email })
  if (!user) return next(new AppError('We cannot find user with this email in our database', 404))
  const resetToken = await user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  user.password = undefined
  // await new sendEmail({
  //   name: user.name,
  //   email: user.email,
  //   emailSubject,
  //   url: `${passwordResetUrl}/?token=${resetToken}`,
  // }).sendResetPassword()

  res.status(200).json({
    status: 'success',
    message: 'Email sent',
  })
})

const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log('RP', req.params)
  const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) return next(new AppError('Token is invlaid or has expired', 400))
  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  sendTokenResponse(res, 200, user)
})

const updateCurrentPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user)
  if (!req.user || !req.user._id) return next(new AppError(`We can't find a user with the supplied credentials}`, 404))
  const user = await User.findById(req.user._id).select('+password')
  if (!user) return next(new AppError('You must be logged in to change your password', 401))
  if (!(await user.checkPassword(req.body.currentPassword, String(user.password))))
    return next(new AppError('Invalid current password', 401))
  user.password = req.body.password
  await user.save()
  res.status(200).json({
    status: 'success',
    user,
    // message: 'Email sent',
    // token: resetToken,
  })
  // sendTokenResponse(res, 200, user)
})

export { signup, completeSignup, signin, protect, forgotPassword, resetPassword, signout, updateCurrentPassword }
