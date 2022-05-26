import { Request, Response, NextFunction } from 'express'
// import { ICategory } from '../../models/category'
// import { Model } from 'mongoose'

// const APIFeatures = require('../utils/APIFeatures')
import AppError from '../../utils/AppError'
import asyncHandler from '../../utils/asyncHandler'

// exports.checkId = (req, res, next, val) => {
//   console.log(`Document id is ${val}`)
//   // return (req.params.id = val * 1)
//   return next()
// }

const fetchAll = (Model: any) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const docs = await Model.find()
    res.status(200).json({
      status: 'success',
      results: docs.length,
      docs,
    })
  })

// const fetchAll = (Model: any) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const totalCount = await Model.countDocuments()
//     const features = new APIFeatures(Model.find(), req.query).filter().sort().fields().search().paginate()
//     const docs = await features.query
//     // const docs = await features.query.explain()
//     res.status(200).json({
//       status: 'succes',
//       totalCount,
//       docs,
//     })
//   })

const fetchDoc = (Model: any) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // console.log('REqPARAMS', req.params)
    const doc = await Model.findById(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(200).json({
      status: 'succes',
      doc,
    })
  })

const createDoc = (Model: any) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // console.log('BODY', req.body)
    // console.log('FILE', req.files)
    const doc = await Model.create(req.body)
    if (!doc) return next(new AppError(`We can't create document ${req.body.name}`, 404))
    res.status(201).json({
      status: 'success',
      doc,
    })
  })

const updateDoc = (Model: any) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return new document
      runValidators: true,
    })
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(200).json({
      status: 'success',
      doc,
    })
  })

const deleteDoc = (Model: any) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(204).json({
      status: 'success',
      doc,
    })
  })

// exports.fetchAll = (Model) =>
// asyncHandler(async (req, res, next) => {
//   // console.log('SESSION', req.session)
//   // req.session.xyz=25
//   // if (req.session.views) {
//   //   req.session.views = req.session.views + 1
//   // } else {
//   //   req.session.views = 1
//   // }
//   // return next(new AppError(`We can't find a document with`, 404))
//   const totalCount = await Model.countDocuments()
//   const features = new APIFeatures(Model.find(), req.query).filter().sort().fields().search().paginate()
//   const docs = await features.query
//   // const docs = await features.query.explain()
//   res.status(200).json({
//     status: 'succes',
//     totalCount,
//     docs,
//   })
// })

// exports.fetchDoc = (Model, populateOptions = {}) =>
//   asyncHandler(async (req, res, next) => {
//     console.log('REqPARAMS', req.params)
//     const doc = await Model.findById(req.params.id)
//     if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
//     res.status(200).json({
//       status: 'succes',
//       doc,
//     })
//     // let query = Model.findById(req.params.id)
//     // if (populateOptions) query.populate(populateOptions)
//     // const doc = await query
//     // if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
//     // res.status(200).json({
//     //   status: 'succes',
//     //   data: doc,
//     // })
//   })

// exports.deleteDocs = (Model) =>
//   asyncHandler(async (req, res, next) => {
//     console.log('DELETEDOCS')
//     const result = await Model.deleteMany(req.body)
//     if (!result) return next(new AppError(`We are not able to delete documents`, 404))
//     res.status(200).json({
//       ...result,
//       status: 'success',
//     })
//   })

export { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc }
