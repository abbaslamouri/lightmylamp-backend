"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const router = (0, express_1.Router)();
router.route('/signup').post(auth_1.signup);
// router.route('/completeSignup/:token').patch(completeSignup)
router.route('/signin').post(auth_1.signin);
router.route('/signout').post(auth_1.signout);
// router.route('/forgotpassword').post(forgotPassword)
// router.route('/resetpassword/:token').patch(resetPassword)
router.use(auth_1.protect);
router.route('/update-current-password').patch(auth_1.updateCurrentPassword);
exports.default = router;
