import asyncHandler from 'express-async-handler'
import OrderSupplier from '../models/orderSupplierModel.js'
import Import from '../models/importModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Create new order supplier
// [POST] /api/orders-suppliers
// private/admin
// before create order must to checked countInStock of product
const addOrderItems = asyncHandler(async (req, res) => {
  const { importItems, orderSupplier, totalPrice } = req.body
  try {
    if (importItems && importItems.length === 0) {
      res.status(400)
      throw new Error('Không có sản phẩm để đặt hàng!')
    } else {
      const findOrderSupplier = await OrderSupplier.findById(orderSupplier)
      if (findOrderSupplier) {
        importItems.forEach((importItem) => {
          const checkExistItem = findOrderSupplier.orderItems.some((item) => {
            return item.product.toString() === importItem.product.toString()
          })
          if (!checkExistItem) {
            res.status(404)
            throw new Error('Sản phẩm này không có trong phiếu đặt!')
          }
        })

        const order = new Import({
          importItems,
          user: req.user._id,
          orderSupplier,
          totalPrice,
        })

        const createOrder = await order.save()
        createOrder.importItems.forEach(async (i) => {
          const product = await Product.findById(i.product)
          if (product) {
            product.countInStock = product.countInStock + i.qty
          }
          await product.save()
        })
        res
          .status(201)
          .json({ status: 'success', data: createOrder, errors: null })
      } else {
        res.status(404)
        throw new Error('Không tìm thấy phiếu đặt này!')
      }
    }
  } catch (error) {
    //const errors = customErrorHandler(error, res)
    res.status(400)
    throw new Error(`${error}`)
  }
})

// @desc    Get order by id
// @router  GET /api/orders/:id
// @access  private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate([
    {
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name image price slug',
        populate: { path: 'category', select: 'name slug' },
      },
    },
    { path: 'user', select: 'name email' },
  ])

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @router  PUT /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updateOrder = await order.save()

    res.status(200).json(updateOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @router  PUT /api/orders/:id/deliver
// @access  private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updateOrder = await order.save()

    res.status(200).json(updateOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @router  GET /api/orders/myorders
// @access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })

  res.json(orders)
})

// @desc    Get all orders
// @router  GET /api/orders
// @access  private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')

  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
