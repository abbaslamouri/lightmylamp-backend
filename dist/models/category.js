"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const media_1 = require("./media");
const schema = new mongoose_1.Schema({
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
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    gallery: [{ type: mongoose_1.Schema.Types.ObjectId, ref: media_1.Media }],
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    this.permalink = this.permalink ? this.permalink : (0, slugify_1.default)(this.name, { lower: true });
    next();
});
schema.pre(/^find/, function (next) {
    this.populate({
        path: 'parent',
        // select: 'name slug',
    });
    this.populate({
        path: 'gallery',
        // select: 'name slug path url mimetype',
    });
    next();
});
const Category = (0, mongoose_1.model)('Category', schema);
exports.Category = Category;
