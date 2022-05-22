"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const folder_1 = require("./folder");
const schema = new mongoose_1.Schema({
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
    folder: { type: mongoose_1.Schema.Types.ObjectId, ref: folder_1.Folder, required: [true, 'Folder is required'] },
}, {
    versionKey: false,
    timestamps: true,
});
// schema.index({ name: 'text', path: 'text' })
// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    this.permalink = this.permalink ? this.permalink : (0, slugify_1.default)(this.name, { lower: true });
    next();
});
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
const Media = (0, mongoose_1.model)('Media', schema);
exports.Media = Media;
