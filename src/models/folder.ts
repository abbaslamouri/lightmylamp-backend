import { Schema, model } from 'mongoose'
import slugify from 'slugify'

interface IFolder {
  name: string
  slug: string
  permalink: String
  sortOrder: Number
}

const schema = new Schema<IFolder>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Folder Name is required'],
      maxlength: [100, 'Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
    permalink: {
      type: String,
      unique: true,
    },
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

const Folder = model<IFolder>('Folder', schema)
export { Folder, IFolder }
