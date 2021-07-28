import express from 'express'
import {
  addItemToCart,
  removeItemFromCart,
  removeAllItemFromCart,
} from '../controllers/cartControllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/add-to-cart/:id', protect, addItemToCart)
router.put('/remove-all-item-cart/', protect, removeAllItemFromCart)
router.put('/remove-item-cart/:id', protect, removeItemFromCart)

export default router
