import { Router } from 'express'

import {
  updateCurrentUserInfo,
  // updateCurrentUserPassword,
  //deleteLoggedIn,
  fetchCurrentUser,
} from '../../controllers/users'

import { fetchAll, createDoc } from '../../controllers/users'
import { protect } from '../../controllers/auth'

const router = Router()

router.use(protect)

router.route('/fetch-current').get(fetchCurrentUser)
router.route('/update-current-info').patch(updateCurrentUserInfo)
// router.route('/update-current-password').patch(updateCurrentUserPassword)
// router.route('/delete-current').delete(deleteLoggedIn)

// router.use(authorize('admin'))

router.route('/').get(fetchAll).post(createDoc)
// router.route('/:id').get(fetchDoc(Model)).patch(updateDoc(Model)).delete(deleteDoc(Model))

export default router
