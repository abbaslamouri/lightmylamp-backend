import { Schema, model } from 'mongoose'
import slugify from 'slugify'

interface INexthigherassembly {
  name: string
  slug: string
  description: string
  sortOrder: Number
}

const schema = new Schema<INexthigherassembly>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Nexthigherassembly Name is required'],
      minlength: [3, 'Too short'],
      maxlength: [100, 'Nexthigherassembly Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters long'],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Virtual populate
// schema.virtual('attributeterms', {
//   ref: 'Attributeterm',
//   foreignField: 'parent',
//   localField: '_id',
// })

// schema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'attributeterms',
//     // select: 'name slug',
//   })
//   next()
// })

const Nexthigherassembly = model<INexthigherassembly>('Nexthigherassembly', schema)
export { Nexthigherassembly, INexthigherassembly }
