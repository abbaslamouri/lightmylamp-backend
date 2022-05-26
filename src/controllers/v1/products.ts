import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/AppError'
import asyncHandler from '../../utils/asyncHandler'
import { Product } from '../../models/product'
// import { createDoc } from './factory'
import { Media } from '../../models/media'

const setProductAuthor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    req.body.createdBy = req.user._id
  }
  // if( req.file ){
  //   req.body.filename = req.file.filename
  //   req.body.path = req.user._id
  // }
  next()
}

const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('BODY', req.body)
  // console.log('FILES', req.files)
  // const uploadFiles = []
  // if (req.files) {
  //   for (let prop in req.files) {
  //     const filename = (req as any).files[prop].filename
  //     const path = (req as any).files[prop].destination.split('/')[1]
  //     uploadFiles[parseInt(prop)] = {
  //       ...(req as any).files[prop],
  //       name: filename,
  //       path,
  //       originalName: (req as any).files[prop].originalname,
  //       url: `${process.env.API_URL}/${path}/${filename}`,
  //     }
  //   }
  // }
  // console.log('uploadFiles', uploadFiles)
  // const media = await Media.create(uploadFiles)
  // if (!media) req.body.gallery = []
  // else req.body.gallery = media
  // const product = await Product.create(req.body)
  // if (!product) return next(new AppError(`We can't create product ${req.body.name}`, 404))
  // res.status(201).json({
  //   status: 'success',
  //   product,
  // })
})

export { setProductAuthor, createProduct }
