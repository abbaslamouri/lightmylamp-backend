import { Schema, model } from 'mongoose'
import slugify from 'slugify'

interface IMedia {
  name: string
  originalName: string
  displayName: string
  altText: string
  caption: string
  slug: string
  sortOrder: Number
  path: string
  mimetype: string
  size: Number
}

const schema = new Schema<IMedia>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'File Name is required'],
      maxlength: [500, 'Name cannot be more than 100 characters long'],
      default: 'placeholder.png',
    },
    slug: {
      type: String,
    },
    originalName: {
      type: String,
    },
    displayName: {
      type: String,
    },
    altText: {
      type: String,
    },
    caption: {
      type: String,
    },
    path: {
      type: String,
      default: '/uploads/placeholder.png',
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
      max: [10 * 1024 * 1024, 'File size ({{VALUE}}) is greater that the maximum allowed of 10MB'],
      required: [true, 'File Size is required'],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    // versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// schema.index({ name: 'text', path: 'text' })

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// // Document Middleware, runs before save() and create()
// schema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   this.confirmPassword = undefined
//   next()
// })

// schema.methods.getSinedJwtToken = async function () {
//   return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
// }

// schema.methods.checkPassword = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }

// schema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//   this.passwordResetExpire = Date.now() + 10 * 60 * 1000
//   return resetToken
// }

// schema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next()
//   this.passwordChangeDate = Date.now() - 1000
//   next()
// })

// schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
//   if (this.passwordChangeDate) {
//     return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
//   }

//   return false
// }

const Media = model<IMedia>('Media', schema)
export { Media, IMedia }
