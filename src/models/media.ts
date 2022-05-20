import { Schema, model, Types } from 'mongoose'
import slugify from 'slugify'
import { Folder } from './folder'

interface IMedia {
  name: string
  slug: string
  sortOrder: Number
  permalink: string
  path: string
  url: string
  mimetype: string
  size: Number
  folder: Types.ObjectId
}

const schema = new Schema<IMedia>(
  {
    name: {
      type: String,
      required: [true, 'File Name is required'],
      maxlength: [500, 'Name cannot be more than 100 characters long'],
      default: 'placeholder.png',
    },
    slug: {
      type: String,
      unique: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },

    path: {
      type: String,
      default: '/placeholder.png',
    },
    url: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
      max: [20000000, 'File size ({{VALUE}}) is greater that the maximum allowed of 200000000'],
      required: [true, 'File Size is required'],
    },
    folder: { type: Schema.Types.ObjectId, ref: Folder, required: [true, 'Folder is required'] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

// schema.index({ name: 'text', path: 'text' })

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  this.permalink = this.permalink ? this.permalink : slugify(this.name, { lower: true })
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
