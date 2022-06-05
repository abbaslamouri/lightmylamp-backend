import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import mongoose, { Types } from 'mongoose'
import slugify from 'slugify'

// const dotenv = require('dotenv')
import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/AppError'
import asyncHandler from '../../utils/asyncHandler'
import { Product, IProduct } from '../../models/product'
import { Media } from '../../models/media'
// import { createDoc } from '../../controllers/v1/factory'
import { Eligibility } from '../../models/eligibility'
import { Category } from '../../models/category'
import { Nexthigherassembly } from '../../models/nexthigherassembly'
import { Oem, IOem } from '../../models/oem'
import { Oempartnumber, IOempartnumber } from '../../models/oempartnumber'

// dotenv.config({ path: './config.env' })

const setProductAuthor = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user) {
    req.body.createdBy = (req as any).user.id
  }
  // if( req.file ){
  //   req.body.filename = req.file.filename
  //   req.body.path = req.user._id
  // }
  next()
}

const seedDb = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log('BODY', req.body)
  console.log('FILES', req.files)

  const db = mongoose.connection.db
  // const collections = await db.listCollections().toArray()
  // console.log('Collections', collections)
  db.dropCollection('products')

  // dbConnect()

  // const parser = parse({
  //   delimiter: ',',
  // })

  // var parser = parse({ columns: true }, function (err, records) {
  //   console.log(records)
  // })

  // // Read data from file
  // const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
  // const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
  // const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
  // const countries = JSON.parse(fs.readFileSync(`${__dirname}/countries.json`, 'utf-8'))
  // const states = JSON.parse(fs.readFileSync(`${__dirname}/states.json`, 'utf-8'))

  // const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'))
  // console.log(path.resolve(__dirname))

  // console.log(`uploads/${(req as any).files[0].filename}`)

  // const processData = (err, data) => {
  //   console.log('JJJJJJ')
  //   if (err) {
  //     console.log(`An error was encountered: ${err}`)
  //     return
  //   }
  //   console.log(data)

  //   // data.shift(); // only required if csv has heading row

  //   // const userList = data.map(row => new User(...row));

  //   // analyseUsers(userList);
  // }
  const data: any[] = []
  fs.createReadStream(`${__dirname}/../../../public/uploads/${(req as any).files[0].filename}`)
    .pipe(parse({ delimiter: ',', columns: true }))
    .on('data', function (row) {
      // console.log(row)
      data.push(row)
    })
    .on('end', async function () {
      let found
      // console.log('finished')
      // console.log('data', data)
      // if (!) return

      // if (!data.length) return
      const products = []

      for (const prop in data) {
        const product = { ...data[prop] }
        product.categories = []
        product.gallery = []
        product.eligibilities = []
        product.nextHigherAssemblies = []

        product.price = product.price * 100
        product.salePrice = product.price
        product.tbq = data[prop].tbq ? true : false
        product.createdBy = (req as any).user.id
        // product.slug = slugify(product.name, { lower: true })

        // console.log(product.price)

        const image = await Media.find({ originalName: `${data[prop].productImage}.jpg` })
        if (image.length) product.gallery.push(image[0].id)

        const categoryArr = [...data[prop].categories.split('|')]
        if (categoryArr.length) {
          for (const prop in categoryArr) {
            categoryArr[prop] = categoryArr[prop].trim()
            const found = await Category.find({ name: categoryArr[prop] })
            if (!found.length) {
              const category = await Category.create({ name: categoryArr[prop] })
              if (category) product.categories.push(category.id)
            } else {
              product.categories.push(found[0].id)
            }
          }
        }

        const eligibilityArr = [...data[prop].eligibilities.split('|')]
        for (const prop in eligibilityArr) {
          eligibilityArr[prop] = eligibilityArr[prop].trim()
          const found = await Eligibility.find({ name: eligibilityArr[prop] })
          if (!found.length) {
            const eligibility = await Eligibility.create({ name: eligibilityArr[prop] })
            if (eligibility) product.eligibilities.push(eligibility.id)
          } else {
            product.eligibilities.push(found[0].id)
          }
        }

        const nextHigherAssembliesArr = [...data[prop].nextHigherAssemblies.split('|')]
        for (const prop in nextHigherAssembliesArr) {
          nextHigherAssembliesArr[prop] = nextHigherAssembliesArr[prop].trim()
          const found = await Nexthigherassembly.find({ name: nextHigherAssembliesArr[prop] })
          if (!found.length) {
            const nextHigherAssembly = await Nexthigherassembly.create({ name: nextHigherAssembliesArr[prop] })
            if (nextHigherAssembly) product.nextHigherAssemblies.push(nextHigherAssembly.id)
          } else {
            product.nextHigherAssemblies.push(found[0].id)
          }
        }

        // const oem = data[prop].oem.trim()
        // for (const prop in oemArr) {
        // oemArr[prop] = oemArr[prop].trim()
        let oem: IOem
        found = await Oem.find({ name: data[prop].oem.trim() })
        if (!found.length) {
          oem = await Oem.create({ name: data[prop].oem.trim() })
          // if (oem) product.oem = oem.id
        } else {
          oem = found[0]
          // product.oem = found[0].id
        }
        // }
        product.oem = oem.id

        let oemPartNumber: IOempartnumber
        found = await Oempartnumber.find({ name: data[prop].oemPartNumber.trim() })
        if (!found.length) {
          oemPartNumber = await Oempartnumber.create({ name: data[prop].oemPartNumber.trim(), parent: oem.id })
          // if (oem) product.oem = oem.id
        } else {
          oemPartNumber = found[0]
          // product.oem = found[0].id
        }

        product.oemPartNumber = oemPartNumber.id

        console.log(product)

        products.push(product)
      }
      console.log('PRODUCTS', products)
      const docs = await Product.create(products)

      res.status(200).json({
        status: 'succes',
        docs,
      })
    })
    .on('error', function (error) {
      console.log(error.message)
    })
})

const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('BODY', req.body)
  // console.log('FILES', products)
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

export { setProductAuthor, seedDb }
