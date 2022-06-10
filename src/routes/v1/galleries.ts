import { Router } from 'express'
import { Gallery } from '../../models/gallery'
import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
// import { createCategory } from '../../controllers/v1/categories'
import { fileUpload } from '../../controllers/v1/fileUpload'
// import {} from '../../controllers/v1/products'

import { protect, authorize } from '../../controllers/v1/auth'
import { saveMedia } from '../../controllers/v1/media'

const router = Router()
router.route('/').get(fetchAll(Gallery))
router.route('/:id').get(fetchDoc(Gallery))

router.use(protect)
// router.use(authorize(['creat-product', 'edit-product']))

router.route('/').post(createDoc(Gallery))
router.route('/:id').delete(deleteDoc(Gallery)).patch(updateDoc(Gallery))

export default router
