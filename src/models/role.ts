import { Schema, model, Types } from 'mongoose'

interface IRole {
  _id: Types.ObjectId
  id: Types.ObjectId
  name: string
  permission: [Types.ObjectId]
}

const schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 50 characters long'],
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },

    // role: {
    //   type: String,
    //   enum: ['admin', 'shop-manager', 'customer', 'user', 'guide', 'lead-guide'],
    //   default: 'user',
    // },
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs before save() and create()
// schema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(12)
//   this.password = await bcrypt.hash(this.password as string, salt)
//   return next()
// })

// schema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next()
//   this.passwordChangeDate = Date.now() - 1000
//   next()
// })

// schema.methods.getSinedJwtToken = async function () {
//   if (process.env.JWT_SECRET)
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
// }

// schema.methods.checkPassword = async function (password: string, hash: string) {
//   return await bcrypt.compare(password, hash)
// }

// schema.methods.hasPasswordChanged = async function (JWTTimestamp: number) {
//   if (this.passwordChangeDate) {
//     return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
//   }
//   return false
// }

// schema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//   this.passwordResetExpires = Date.now() + Number(process.env.PW_RESET_TOKEN_EXPIRESIN) * 60 * 1000
//   return resetToken
// }

const Role = model<IRole>('Role', schema)
export { Role, IRole }
