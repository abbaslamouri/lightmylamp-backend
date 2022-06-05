import path from 'path'
import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { extname } from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
    console.log('FILE', file)
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname)
    // console.log(path.basename(file.originalname))
    // const randomName = Math.random().toString(20)
    // cb(null, `${Date.now()}-${file.originalname}${extname(file.originalname)}`)
    // cb(null, `${Date.now()}${extname(file.originalname)}`)
    cb(null, `${file.originalname.split('.')[0]}-${Date.now()}${extname(file.originalname)}`)
  },
})
const fileUpload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024, files: 200, fields: 1 }, // 1MB
  fileFilter: (req, file, cb) => {
    // console.log(file)
    if (file.mimetype.includes('image') || file.mimetype.includes('pdf') || file.mimetype.includes('csv')) {
      cb(null, true)
    } else {
      cb(null, false)
      const err = new Error('Only image, pdf and csv format allowed!')
      err.name = 'ExtensionError'
      return cb(err)
    }
  },
}).array('gallery')

export { fileUpload }
