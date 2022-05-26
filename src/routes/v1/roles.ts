import { Router } from 'express'
import { Role } from '../../models/role'
import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
import { protect } from '../../controllers/v1/auth'

const router = Router()
router.use(protect)
router.route('/').get(fetchAll(Role)).post(createDoc(Role))
router.route('/:id').delete(deleteDoc(Role)).patch(updateDoc(Role)).get(fetchDoc(Role))

export default router
