import { Schema, model, Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

interface IPhone {
  phoneType: string
  phoneNumber: string
  phoneCountryCode: Types.ObjectId
}

interface IShippingAddress {
  company: string
  name: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  state: Types.ObjectId
  postalCode: string
  country: Types.ObjectId
  addressType: string
  isDefault: Boolean
  selected: Boolean
  phones: Array<IPhone>
}

interface IBillingAddress {
  addressLine1: string
  addressLine2: string
  city: string
  state: Types.ObjectId
  postalCode: string
  country: Types.ObjectId
}

interface IUser {
  _id: Types.ObjectId
  id: Types.ObjectId
  stripeCustomerId: String
  name: string
  email: string
  title: string
  shippingAddresses: Array<IShippingAddress>
  billingAddress: IBillingAddress
  description: string
  sortOrder: Number
  parent: Types.ObjectId
  gallery: Types.ObjectId
  avatar: Types.ObjectId
  role: string
  password: unknown
  // passwordConfirm: string
  active: boolean
  deliveryInstructions: string
  passwordResetToken: unknown
  passwordResetExpires: unknown
  passwordChangeDate: number
  createdAt: Date
  updatedAt: Date
  getSinedJwtToken(): Promise<string>
  createPasswordResetToken(): Promise<string>
  checkPassword(password: string, hash: string): Promise<boolean>
  hasPasswordChanged(JWTTimestamp: number): Promise<boolean>
}

const schema = new Schema<IUser>(
  {
    stripeCustomerId: {
      type: 'String',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 50 characters long'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [20, 'Title cannot be more than 20 characters long'],
    },
    shippingAddresses: [
      {
        company: String,
        name: String,
        email: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: {
          type: Schema.Types.ObjectId,
          ref: 'State',
        },
        postalCode: {
          type: String,
        },
        country: {
          type: Schema.Types.ObjectId,
          ref: 'Country',
        },
        addressType: {
          type: String,
          enum: ['Residential', 'Commercial'],
          default: 'Residential',
        },
        isDefault: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        phones: [
          {
            phoneType: {
              type: String,
              enum: ['Cell', 'Work', 'Home'],
              default: 'Cell',
            },
            phoneNumber: String,
            phoneCountryCode: {
              type: Schema.Types.ObjectId,
              ref: 'Country',
            },
          },
        ],
      },
    ],
    billingAddress: {
      address1: String,
      address2: String,
      city: String,
      state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
      },
      postalCode: String,
      country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
      },
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    role: {
      type: String,
      enum: ['admin', 'shop-manager', 'customer', 'user', 'guide', 'lead-guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Pasword is required'],
      minlength: [8, 'Password must contain at least 8 charcaters'],
      select: false,
    },
    // passwordConfirm: {
    //   type: String,
    //   validate: {
    //     // Only works on save()/create()
    //     validator: function (val: string) {
    //       return val === this.password
    //     },
    //     message: 'Passwords dont match',
    //   },
    // },
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
    deliveryInstructions: {
      type: String,
      maxlength: [2000, '2000 characters maximum'],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangeDate: Date,
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs before save() and create()
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password as string, salt)
  return next()
})

schema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangeDate = Date.now() - 1000
  next()
})

schema.methods.getSinedJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN })
}

schema.methods.checkPassword = async function (password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

schema.methods.hasPasswordChanged = async function (JWTTimestamp: number) {
  if (this.passwordChangeDate) {
    return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
  }
  return false
}

schema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpires = Date.now() + Number(process.env.PW_RESET_TOKEN_EXPIRESIN) * 60 * 1000
  return resetToken
}

const User = model<IUser>('User', schema)
export { User, IUser }
