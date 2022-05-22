"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const schema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    this.permalink = this.permalink ? this.permalink : (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const Folder = (0, mongoose_1.model)('Folder', schema);
exports.Folder = Folder;
