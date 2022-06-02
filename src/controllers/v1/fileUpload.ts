import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { extname } from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    // const randomName = Math.random().toString(20)
    // cb(null, `${Date.now()}-${file.originalname}${extname(file.originalname)}`)
    cb(null, `${Date.now()}${extname(file.originalname)}`)
  },
})
const fileUpload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024, files: 20, fields: 1 }, // 1MB
  fileFilter: (req, file, cb) => {
    // console.log(file)
    if (file.mimetype.includes('image') || file.mimetype.includes('pdf')) {
      cb(null, true)
    } else {
      cb(null, false)
      const err = new Error('Only image format allowed!')
      err.name = 'ExtensionError'
      return cb(err)
    }
  },
}).array('gallery')

export { fileUpload }
