"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../controllers/users");
const users_2 = require("../../controllers/users");
const auth_1 = require("../../controllers/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.route('/fetch-current').get(users_1.fetchCurrentUser);
router.route('/update-current-info').patch(users_1.updateCurrentUserInfo);
// router.route('/update-current-password').patch(updateCurrentUserPassword)
// router.route('/delete-current').delete(deleteLoggedIn)
// router.use(authorize('admin'))
router.route('/').get(users_2.fetchAll).post(users_2.createDoc);
// router.route('/:id').get(fetchDoc(Model)).patch(updateDoc(Model)).delete(deleteDoc(Model))
exports.default = router;
