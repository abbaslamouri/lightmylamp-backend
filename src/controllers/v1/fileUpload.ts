import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { extname } from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // const randomName = Math.random().toString(20)
    // cb(null, `${Date.now()}-${file.originalname}${extname(file.originalname)}`)
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const fileUpload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
    } else {
      cb(null, false)
      const err = new Error('Only image format allowed!')
      err.name = 'ExtensionError'
      return cb(err)
    }
  },
}).array('gallery', 10)

// const fileUpload = (req: Request, res: Response, next: NextFunction) => {
//   // if (req.user) req.body.createdBy = req.user._id
//   console.log('RB', req.file)
//   res.status(201).json({
//     status: 'success',
//     // doc,
//   })

//   // next()
// }

export { fileUpload }
