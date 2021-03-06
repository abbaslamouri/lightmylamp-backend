import { Router } from 'express'
import { Permission } from '../../models/permission'
import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
import { protect } from '../../controllers/v1/auth'

const router = Router()
router.use(protect)
router.route('/').get(fetchAll(Permission)).post(createDoc(Permission))
router.route('/:id').delete(deleteDoc(Permission)).patch(updateDoc(Permission)).get(fetchDoc(Permission))

export default router
