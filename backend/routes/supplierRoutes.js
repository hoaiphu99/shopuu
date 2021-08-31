import express from 'express'
import {
  getSuppliers,
  createSupplier,
} from '../controllers/SupplierControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getSuppliers)
router.post('/', protect, admin, createSupplier)
// router.post('/', protect, admin, createBrand)
// router.put('/:id', protect, admin, updateBrand)
// router.delete('/:id', protect, admin, deleteBrand)
// router.delete('/:id/force', protect, admin, deleteBrandForce)

export default router
