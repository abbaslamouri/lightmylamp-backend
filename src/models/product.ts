import { Schema, model, Types } from 'mongoose'
import { Category } from './category'
import { Variant } from './variant'

import slugify from 'slugify'

interface IAttribute {
  attribute: Types.ObjectId
  terms: [Types.ObjectId]
  defaultTerm: Types.ObjectId
  enabled: boolean
  variation: boolean
}

// enum ETaxStatus {
//   taxable,
//   shippingOnly,
//   none,
// }

// enum ETaxClass {
//   standard,
//   reducedRate,
//   zero,
// }

// enum EAllowBackOrder {
//   allow,
//   disallow,
//   notify,
// }

interface IProduct {
  _id: Types.ObjectId
  id: Types.ObjectId
  stripeCustomerId: String
  name: string
  slug: string
  acsPartNumber: string
  eligibilities: string
  nextHigherAssemblies: string
  // oem: string
  oemPartNumber: string
  productType: string
  price: number
  salePrice: number
  description: string
  excerpt: string
  active: boolean
  gallery: [Types.ObjectId]
  sku: string
  taxStatus: string
  taxClass: string
  manageInventory: boolean
  tbq: boolean
  stockQty: number
  allowBackorders: string
  lowStockThreshold: number
  sortOrder: number
  // categories: [Types.ObjectId]
  attributes: [IAttribute]
  variants: [Types.ObjectId]
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  // getSinedJwtToken(): Promise<string>
  // createPasswordResetToken(): Promise<string>
  // checkPassword(password: string, hash: string): Promise<boolean>
  // hasPasswordChanged(JWTTimestamp: number): Promise<boolean>
}

const schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxlength: [50, 'Name cannot be more than 100 characters long'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    acsPartNumber: {
      type: String,
    },
    eligibilities: [{ type: Schema.Types.ObjectId, ref: 'Eligibility' }],
    nextHigherAssemblies: [{ type: Schema.Types.ObjectId, ref: 'Nexthigherassembly' }],
    // oem: {
    //   type: String,
    // },
    oemPartNumber: { type: Schema.Types.ObjectId, ref: 'Oempartnumber' },
    tbq: {
      type: Boolean,
      default: false,
    },
    // permalink: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    // },
    sku: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    // seoTitle: {
    //   type: String,
    // },
    // seoDescription: {
    //   type: String,
    // },
    description: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    excerpt: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    // intensity: {
    //   type: String,
    //   maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    // },
    // roastiness: {
    //   type: String,
    //   maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    // },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    productType: {
      type: String,
    },
    // virtual: {
    //   type: Boolean,
    //   default: false,
    // },
    // downloadable: {
    //   type: Boolean,
    //   default: false,
    // },
    taxStatus: {
      type: String,
      enum: ['taxable', 'shippingOnly', 'none'],
    },
    taxClass: {
      type: String,
      enum: ['standard', 'reducedRate', 'zero'],
    },

    manageInventory: {
      type: Boolean,
      default: false,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    allowBackorders: {
      type: String,
      enum: ['allow', 'disallow', 'notify'],
      default: 'notify',
    },
    lowStockThreshold: {
      type: Number,
      default: 2,
    },
    // shippingOptions: {
    //   type: Boolean,
    //   default: false,
    // },
    // shipping: {
    //   weight: String,
    //   dimensions: {
    //     length: String,
    //     width: String,
    //     height: String,
    //   },
    // },
    sortOrder: {
      type: Number,
      default: 0,
    },
    // categories: [
    //   {
    //     // type: mongoose.Schema.Types.ObjectId,
    //     // ref: 'Category',
    //     type: Schema.Types.ObjectId,
    //     ref: Category,
    //   },
    // ],
    // attributes: Array,
    // attributes: [
    //   {
    //     // type: Schema.Types.ObjectId,
    //     // ref: 'Attribute',
    //     attribute: { type: Schema.Types.ObjectId, ref: 'Attribute' },
    //     terms: [{ type: Schema.Types.ObjectId, ref: 'Attributeterm' }],
    //     defaultTerm: { type: Schema.Types.ObjectId, ref: 'Attributeterm' },
    //     enabled: {
    //       type: Boolean,
    //       default: false,
    //     },
    //     variation: {
    //       type: Boolean,
    //       default: false,
    //     },
    //   },
    // ],
    // variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
    // soldQty: {
    //   type: Number,
    //   default: 0,
    // },
    // orders: {
    //   type: Number,
    //   default: 0,
    // },
    // sales: {
    //   type: Number,
    //   default: 0,
    // },
    // ratings: [
    //   {
    //     rating: Number,
    //     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Review author is required'] },
    //   },
    // ],
    // ReviewsCount: {
    //   type: Number,
    //   default: 0,
    // },
    createdBy: {
      // type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Product author is required']
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product author is required'],
    },
    // tahnkYouPage: {
    //   type: String,
    // },
    // extraFields: [
    //   {
    //     name: String,
    //     isRequired: Boolean,
    //   },
    // ],
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// schema.virtual('variants', {
//   ref: 'Variant',
//   foreignField: 'product',
//   localField: '_id',
// })

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  // this.permalink = this.permalink ? this.permalink : slugify(this.name, { lower: true })
  next()
})

schema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'categories',
  //   // model: 'Category',
  //   // select: 'name slug permalink',
  // })
  this.populate({
    path: 'gallery',
    // model: 'Media',
    // select: 'name slug path url mimetype',
  })
  // this.populate({
  //     path: 'variants',
  //     model: 'Variant',
  //     select: '-createdAt',
  //   })
  // this.populate({
  //   path: 'attributes',
  //   // model: 'Attribute',
  //   // select: '-createdAt',
  // })
  this.populate({
    path: 'eligibilities',
    // model: 'Attribute',
    // select: '-createdAt',
  })
  this.populate({
    path: 'nextHigherAssemblies',
    // model: 'Attribute',
    // select: '-createdAt',
  })
  // this.populate({
  //   path: 'attributes.attribute',
  //   // model: 'Attribute',
  //   // select: '-createdAt',
  // })
  // this.populate({
  //   path: 'attributes.terms',
  //   // model: 'Attributeterm',
  //   // select: '-createdAt',
  // })
  // this.populate({
  //   path: 'attributes.defaultTerm',
  //   // model: 'Attributeterm',
  //   // select: '-createdAt',
  // })
  this.populate({
    path: 'oemPartNumber',
    // model: 'Attributeterm',
    // select: '-createdAt',
  })

  next()
})

const Product = model<IProduct>('Product', schema)
export { Product, IProduct }
