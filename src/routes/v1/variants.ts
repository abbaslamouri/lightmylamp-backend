import { Router } from 'express'
import { Variant } from '../../models/variant'
// import { setProductAuthor } from '../../controllers/v1/products'

import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
// import { createCategory } from '../../controllers/v1/categories'
import { fileUpload } from '../../controllers/v1/fileUpload'
// import {} from '../../controllers/v1/products'

import { protect, authorize } from '../../controllers/v1/auth'
import { saveMedia } from '../../controllers/v1/media'

const router = Router()

router.route('/').get(fetchAll(Variant))
router.route('/:id').get(fetchDoc(Variant))

router.use(protect)
// router.use(authorize(['creat-Variant', 'edit-Variant']))

router.route('/').post(createDoc(Variant))
router.route('/:id').delete(deleteDoc(Variant)).patch(updateDoc(Variant))

export default router

// import { Router } from 'express'
// import { Product } from '../../models/product'
// import { fetchAll, fetchDoc, createDoc, deleteDoc, updateDoc } from '../../controllers/v1/factory'
// import { setProductAuthor, createProduct } from '../../controllers/v1/products'
// import { fileUpload } from '../../controllers/v1/fileUpload'
// // import {} from '../../controllers/v1/products'

// import { protect, authorize } from '../../controllers/v1/auth'
// import { saveMedia } from '../../controllers/v1/media'

// const router = Router()
// router.use(protect)
// // router.use(authorize(['creat-product', 'edit-product']))
// router.route('/').get(fetchAll(Product)).post(fileUpload, setProductAuthor, saveMedia, createDoc(Product))
// router.route('/:id').delete(deleteDoc(Product)).patch(updateDoc(Product)).get(fetchDoc(Product))

// export default router
