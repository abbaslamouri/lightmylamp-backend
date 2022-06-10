import { Schema, model, Types } from 'mongoose'
import slugify from 'slugify'
import { Media } from './media'

interface IGallery {
  name: string
  slug: string
  description: string
  sortOrder: Number
  gallery: Types.ObjectId
}

const schema = new Schema<IGallery>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Gallery Name is required'],
      minlength: [3, 'Name too short'],
      maxlength: [100, 'Name too long'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters long'],
    },
    gallery: [{ type: Schema.Types.ObjectId, ref: Media }],
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

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'gallery',
    // select: 'name slug path url mimetype',
  })

  next()
})

const Gallery = model<IGallery>('Gallery', schema)
export { Gallery, IGallery }
