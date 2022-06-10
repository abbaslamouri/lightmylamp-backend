import { unlink } from 'fs'
import { Request, Response, NextFunction } from 'express'
import APIFeatures from '../../utils/apiFeatures'
import AppError from '../../utils/AppError'
import asyncHandler from '../../utils/asyncHandler'
import { Media } from '../../models/media'
// import { Folder } from '../../models/folder'

const fetchAllMedia = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('REqPARAMS', req.query)
  // const indexes = await (Media as any).cleanIndexes()
  // console.log('INDEXES', indexes)
  // let totalCount
  // if (req.query.folder) totalCount = await Media.countDocuments({ folder: req.query.folder })
  const totalCount = await Media.countDocuments()
  const features = new APIFeatures(Media.find(), req.query, Media).filter().sort().fields().search().paginate()
  const docs = await features.query
  // const docs = await features.query.explain()
  res.status(200).json({
    status: 'succes',
    totalCount,
    results: docs.length,
    docs,
  })
}

const saveMedia = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('FILES', req.files)
  // console.log('FILES', req.body)
  const uploadFiles = []
  // const folder = await Folder.findById(req.body.folder)
  if (req.files) {
    for (let prop in req.files) {
      const filename = (req as any).files[prop].filename
      const path = (req as any).files[prop].destination.split('/')
      uploadFiles[parseInt(prop)] = {
        ...(req as any).files[prop],
        name: (req as any).files[prop].filename.split('.')[0],
        path: `${path[path.length - 1]}/${filename}`,
        originalName: (req as any).files[prop].originalname,
        // folder,
      }
    }
  }
  const media = await Media.create(uploadFiles)
  if (!media) return next(new AppError(`There are no files to save`, 404))
  res.status(201).json({
    status: 'success',
    media,
  })
})

const deleteMedia = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('FILES', req.params)
  const doc = await Media.findByIdAndDelete(req.params.id)
  if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
  unlink(`./public/${doc.path}`, (err) => {
    if (err) {
      return next(new AppError(`We were not able to unlink file ${doc.name}`, 404))
    }
  })
  res.status(204).json({
    status: 'success',
    doc,
  })
})
export { fetchAllMedia, saveMedia, deleteMedia }
