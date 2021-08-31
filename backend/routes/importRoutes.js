import express from 'express'
import {
  addOrderItems,
  getOrderById,
  getOrders,
} from '../controllers/importControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getOrders)
router.post('/', protect, addOrderItems)
router.get('/:id', protect, getOrderById)

export default router
