import { Router } from 'express'

import {
  updateCurrentUserInfo,
  //deleteLoggedIn,
  fetchCurrentUser,
} from '../../controllers/v1/users'

import { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc } from '../../controllers/v1/factory'
import { protect, authorize } from '../../controllers/v1/auth'
import { User } from '../../models/user'

const router = Router()

router.use(protect)

router.route('/fetch-current').get(fetchCurrentUser)
router.route('/update-current-info').patch(updateCurrentUserInfo)

// router.use(authorize(['admin']))

router.route('/').get(fetchAll(User)).post(createDoc(User))
router.route('/:id').get(fetchDoc(User)).patch(updateDoc(User)).delete(deleteDoc(User))

export default router
