import { Router } from 'express'
import { Category } from '../../models/category'
import { fetchAll, createDoc } from '../../controllers/v1/factory'

const router = Router()

router.route('/').get(fetchAll(Category)).post(createDoc(Category))
// router.route('/:id').patch(updateDoc(Model)).delete(deleteDoc(Model))

export default router
