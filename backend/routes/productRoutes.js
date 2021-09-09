import express from 'express'
import {
  getProducts,
  getProductsByCategory,
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  forceDeleteProduct,
  createProductReview,
  getTopProducts,
  getTopBuyProducts,
  productBestSeller,
  updateDiscountProduct,
  getDiscountProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/all', getAllProducts)
router.get('/top', getTopProducts)
router.get('/discount', getDiscountProduct)
router.get('/topbuy', protect, admin, getTopBuyProducts)
router.get('/best-seller', protect, admin, productBestSeller)
router.get('/category/:slug', getProductsByCategory)
router.post('/', protect, admin, createProduct)
router.get('/:id', getProductById)
router.get('/:slug/get', getProductBySlug)
router.put('/discount-update', protect, admin, updateDiscountProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)
router.delete('/:id/force', protect, admin, forceDeleteProduct)
router.post('/:id/review', protect, createProductReview)

export default router
