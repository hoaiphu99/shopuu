import express from 'express'
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  forceDeleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/top', getTopProducts)
router.post('/', protect, admin, createProduct)
router.get('/:id', getProductById)
router.get('/:slug/get', getProductBySlug)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)
router.delete('/:id/force', protect, admin, forceDeleteProduct)
router.post('/:id/review', protect, createProductReview)

export default router
