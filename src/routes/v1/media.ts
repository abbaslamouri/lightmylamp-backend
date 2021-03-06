import { Router } from 'express'
import { Media } from '../../models/media'
// import { Folder } from '../../models/folder'
import { fetchAll, fetchDoc, createDoc, deleteDoc, deleteDocs, updateDoc } from '../../controllers/v1/factory'
// import { setProductAuthor, createProduct } from '../../controllers/v1/products'
import { fileUpload } from '../../controllers/v1/fileUpload'
// import {} from '../../controllers/v1/products'

import { protect, authorize } from '../../controllers/v1/auth'
import { fetchAllMedia, saveMedia, deleteMedia } from '../../controllers/v1/media'

const router = Router()
// router.route('/folders').get(fetchAll(Folder))
// router.route('/folders/').post(createDoc(Folder))
// router.route('/folders/:id').patch(updateDoc(Folder))
// router.route('/folders/:id').delete(deleteDoc(Folder))


// router.route('/').get(fetchAll(Media))
// router.route('/').post(saveFile)
// router.route('/:id').delete(deleteFile)
router.route('/:id').patch(updateDoc(Media))
// router.use(protect)
// router.use(authorize(['creat-product', 'edit-product']))
// router.route('/delete-many').post(deleteDocs(Media))

router.route('/').get(fetchAllMedia).post(fileUpload, saveMedia)
router.route('/:id').delete(deleteMedia).patch(updateDoc(Media)).get(fetchDoc(Media))

export default router
