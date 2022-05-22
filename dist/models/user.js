"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schema = new mongoose_1.Schema({
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'State',
            },
            postalCode: {
                type: String,
            },
            country: {
                type: mongoose_1.Schema.Types.ObjectId,
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
                        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'State',
        },
        postalCode: String,
        country: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Country',
        },
    },
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Document Middleware, runs before save() and create()
schema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(12);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    return next();
});
schema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangeDate = Date.now() - 1000;
    next();
});
schema.methods.getSinedJwtToken = async function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
schema.methods.checkPassword = async function (password, hash) {
    return await bcryptjs_1.default.compare(password, hash);
};
schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangeDate) {
        return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp;
    }
    return false;
};
schema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + Number(process.env.PW_RESET_TOKEN_EXPIRESIN) * 60 * 1000;
    return resetToken;
};
const User = (0, mongoose_1.model)('User', schema);
exports.User = User;
