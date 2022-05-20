import { Schema, model, Types } from 'mongoose'
import slugify from 'slugify'
import { Media } from './media'

interface ICategory {
  name: string
  slug: string
  permalink: string
  description: string
  sortOrder: Number
  parent: Types.ObjectId
  gallery: Types.ObjectId
}

const schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Category Name is required'],
      minlength: [3, 'Name too short'],
      maxlength: [100, 'Name too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    permalink: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters long'],
    },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    gallery: [{ type: Schema.Types.ObjectId, ref: Media }],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  this.permalink = this.permalink ? this.permalink : slugify(this.name, { lower: true })
  next()
})

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'parent',
    // select: 'name slug',
  })
  this.populate({
    path: 'gallery',
    // select: 'name slug path url mimetype',
  })

  next()
})

const Category = model<ICategory>('Category', schema)
export { Category, ICategory }
