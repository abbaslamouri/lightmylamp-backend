"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../../models/category");
const factory_1 = require("../../controllers/factory");
const router = (0, express_1.Router)();
router.route('/').get((0, factory_1.fetchAll)(category_1.Category)).post((0, factory_1.createDoc)(category_1.Category));
// router.route('/:id').patch(updateDoc(Model)).delete(deleteDoc(Model))
exports.default = router;
