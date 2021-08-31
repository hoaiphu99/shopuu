import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'
import { OrderStatus } from '../constants/orderStatusConstants.js'

// Create new order
// [POST] /api/orders
// private
// before create order must to checked countInStock of product
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('Không có sản phẩm để đặt hàng!')
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      })

      const createOrder = await order.save()
      createOrder.orderItems.forEach(async (i) => {
        const product = await Product.findById(i.product)
        if (product && product.countInStock > 0) {
          product.countInStock = product.countInStock - i.qty
        } else {
          res.status(400)
          throw new Error(`${product.name} đã hết hàng!`)
        }
        await product.save()
      })
      res
        .status(201)
        .json({ status: 'success', data: createOrder, errors: null })
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
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

// Update order status
// PUT /api/orders/:id/status
// private
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    const stt = req.query.stt
    if (order) {
      switch (stt) {
        case OrderStatus.ACCEPT:
          if (order.status === OrderStatus.WAIT) {
            order.status = OrderStatus.ACCEPT
          } else {
            res.status(400)
            throw new Error('Đơn hàng này đã được xác nhận hoặc đã hoàn thành!')
          }
          break
        case OrderStatus.CANCEL:
          if (
            order.status === OrderStatus.WAIT ||
            order.status === OrderStatus.ACCEPT
          ) {
            order.status = OrderStatus.CANCEL
            order.orderItems.forEach(async (i) => {
              const product = await Product.findById(i.product)
              if (product) {
                product.countInStock = product.countInStock + i.qty
              }
              await product.save()
            })
          } else {
            res.status(400)
            throw new Error('Đơn hàng này đã được hủy!')
          }
          break
        case OrderStatus.FINISH:
          if (order.status === OrderStatus.ACCEPT) {
            order.isPaid = true
            order.paidAt = Date.now()
            order.isDelivered = true
            order.deliveredAt = Date.now()
            order.status = OrderStatus.FINISH
          } else {
            res.status(400)
            throw new Error('Đơn hàng này chưa xác nhận hoặc đã bị hủy!')
          }
          break
        default:
          break
      }
      const updateOrder = await order.save()
      res.status(200).json(updateOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
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
    order.status = OrderStatus.FINISH

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
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
