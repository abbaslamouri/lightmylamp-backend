import os from 'os'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
// import AppError from './utils/AppError'
// import { createClient } from 'redis'
// import connectRedis from 'connect-redis'
// import session from 'express-session'
import errorHandler from './utils/errorHandler'
// import config from './config/default'
// import categoryRouter from './routes/v1/categories'
import authRouter from './routes/v1/auth'
import userRouter from './routes/v1/users'
import permissionRouter from './routes/v1/permissions'
import roleRouter from './routes/v1/roles'
import mediaRouter from './routes/v1/media'
import categoryRouter from './routes/v1/categories'
import attributeRouter from './routes/v1/attributes'
import attributetermsRouter from './routes/v1/attributeterms'
import productRouter from './routes/v1/products'
import variantRouter from './routes/v1/variants'
import { IUser } from './models/user'
dotenv.config()

declare module 'express' {
  interface Request {
    user?: IUser
  }
}

// declare module 'express-session' {
//   export interface SessionData {
//     user: { [key: string]: any }
//   }
// }

// let RedisStore = connectRedis(session)
// let redisClient = createClient({
//   url: `${config.REDIS_IP}:${config.REDIS_PORT}`,
//   legacyMode: true,
// })

const app = express()
app.set('trust proxy', true)
app.use(
  cors({
    // credentials: true,
    origin: ['http://localhost:3000'],
  })
)

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: config.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 300000, httpOnly: true },
//   })
// )

app.use(express.json({ limit: '1000kb' }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/v1/ping', async (req, res) => {
  console.log(`Sending response from container ${os.hostname()}`)
  res.status(200).json({
    status: `success`,
    environment: process.env.NODE_ENV,
    message: 'pong!',
    url: req.url,
    host: req.hostname,
    path: req.path,
    originalUrl: req.originalUrl,
    response: `Sending response from container ${os.hostname()}`,
  })
})
// app.use('/api/v1/categories', categoryRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/users', userRouter)
app.use('/v1/permissions', permissionRouter)
app.use('/v1/roles', roleRouter)
app.use('/v1/media', mediaRouter)
app.use('/v1/categories', categoryRouter)
app.use('/v1/attributes', attributeRouter)
app.use('/v1/attributeterms', attributetermsRouter)
app.use('/v1/products', productRouter)
app.use('/v1/variants', variantRouter)
// app.all('*', async (req: Request, res: Response, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
// })

app.use(errorHandler)

export default app
