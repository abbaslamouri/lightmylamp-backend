import { Router } from 'express'
import { Category } from '../../models/category'
import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
// import { createCategory } from '../../controllers/v1/categories'
import { fileUpload } from '../../controllers/v1/fileUpload'
// import {} from '../../controllers/v1/products'

import { protect, authorize } from '../../controllers/v1/auth'
import { saveMedia } from '../../controllers/v1/media'

const router = Router()

router.route('/').get(fetchAll(Category))
router.route('/:id').get(fetchDoc(Category))

router.use(protect)
// router.use(authorize(['creat-product', 'edit-product']))

router.route('/').post(createDoc(Category))
router.route('/:id').delete(deleteDoc(Category)).patch(updateDoc(Category))

export default router
