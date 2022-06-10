import fs from 'fs'
import { parse } from 'csv-parse'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import asyncHandler from '../../utils/asyncHandler'
import { Product } from '../../models/product'
import { Media } from '../../models/media'
import { Eligibility } from '../../models/eligibility'
import { Nexthigherassembly } from '../../models/nexthigherassembly'
import { Oem, IOem } from '../../models/oem'
import { Oempartnumber, IOempartnumber } from '../../models/oempartnumber'

const setProductAuthor = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user) req.body.createdBy = (req as any).user.id
  next()
}

const createSubModels = async (product: any, dbTable: any, Model: any, atrributes: any) => {
  if (atrributes) {
    const AttributesArr = [...atrributes.split('|')]
    if (!AttributesArr.length) return
    for (const prop in AttributesArr) {
      AttributesArr[prop] = AttributesArr[prop].trim()
      const found = await Model.find({ name: AttributesArr[prop] })
      if (!found.length) {
        const attribute = await Model.create({ name: AttributesArr[prop] })
        if (attribute) product[dbTable].push(attribute.id)
      } else {
        product[dbTable].push(found[0].id)
      }
    }
  }
  return product
}

const createProducts = async (req: Request, data: any) => {
  let found
  console.log('data', data)
  for (const prop in data) {
    let product = { ...data[prop] }
    product.name = data[prop].acsPartNumber
    product.gallery = []
    product.eligibilities = []
    product.nextHigherAssemblies = []
    product.price = product.price * 1
    product.tbq = data[prop].tbq ? true : false
    product.createdBy = (req as any).user.id

    let oem: IOem
    found = await Oem.find({ name: data[prop].oem.trim() })
    if (!found.length) {
      oem = await Oem.create({ name: data[prop].oem.trim() })
    } else {
      oem = found[0]
    }
    product.oem = oem.id

    let oemPartNumber: IOempartnumber
    found = await Oempartnumber.find({ name: data[prop].oemPartNumber.trim() })
    if (!found.length) {
      oemPartNumber = await Oempartnumber.create({ name: data[prop].oemPartNumber.trim(), parent: oem.id })
    } else {
      oemPartNumber = found[0]
    }
    product.oemPartNumber = oemPartNumber.id

    const image = await Media.find({ originalName: `${data[prop].productImage}.jpg` })
    if (image.length) product.gallery.push(image[0].id)

    product = await createSubModels(product, 'eligibilities', Eligibility, data[prop].eligibilities)
    product = await createSubModels(
      product,
      'nextHigherAssemblies',
      Nexthigherassembly,
      data[prop].nextHigherAssemblies
    )

    console.log(product)
    await Product.create(product)
  }
}

const seedDb = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const db = mongoose.connection.db
  // const collections = await db.listCollections().toArray()
  // console.log('Collections', collections)
  db.dropCollection('products')
  db.dropCollection('eligibilities')
  db.dropCollection('nexthigherassemblies')

  const data: any[] = []
  fs.createReadStream(`${__dirname}/../../../public/uploads/${(req as any).files[0].filename}`)
    .pipe(parse({ delimiter: ',', columns: true }))
    .on('data', function (row) {
      data.push(row)
    })
    .on('end', async function () {
      await createProducts(req, data)
      res.status(200).json({
        status: 'succes',
      })
    })
    .on('error', function (error) {
      console.log(error.message)
    })
})

export { setProductAuthor, seedDb }
