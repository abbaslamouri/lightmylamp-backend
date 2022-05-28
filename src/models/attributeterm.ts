import { Schema, model, Types } from 'mongoose'
import slugify from 'slugify'

interface IAttributeterm {
  name: string
  slug: string
  description: string
  sortOrder: Number
  parent: Types.ObjectId
}
const schema = new Schema<IAttributeterm>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, ' Name is required'],
      // minlength: [3, 'Too short'],
      maxlength: [100, 'Name cannot be more than 100 characters long'],
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
    parent: { type: Schema.Types.ObjectId, ref: 'Attribute' },

    // parent: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Attribute',
    // required: [true, 'Attribute term parent is required'],
    // },
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

const Attributeterm = model<IAttributeterm>('Attributeterm', schema)
export { Attributeterm, IAttributeterm }
