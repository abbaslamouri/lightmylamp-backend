import { Router } from 'express'
import {
  signup,
  // completeSignup,
  signin,
  // forgotPassword,
  // resetPassword,
  updateCurrentPassword,
  protect,
  signout,
} from '../../controllers/auth'

const router = Router()

router.route('/signup').post(signup)
// router.route('/completeSignup/:token').patch(completeSignup)
router.route('/signin').post(signin)
router.route('/signout').post(signout)
// router.route('/forgotpassword').post(forgotPassword)
// router.route('/resetpassword/:token').patch(resetPassword)

router.use(protect)

router.route('/update-current-password').patch(updateCurrentPassword)

export default router
