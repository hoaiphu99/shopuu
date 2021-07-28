import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Add items to cart
// @router  PUT /api/cart/add-to-cart/:id-product
// @access  private
const addItemToCart = asyncHandler(async (req, res) => {
  const qty = req.query.qty

  const product = await Product.findById(req.params.id)

  if (product) {
    const item = {
      qty,
      name: product.name,
      product: product._id,
    }

    const alreadyAdded = req.user.cartItems.find(
      (item) => item.product._id.toString() === product._id.toString()
    )
    if (alreadyAdded) {
      alreadyAdded.qty = qty || item.qty
    } else {
      req.user.cartItems.push(item)
    }

    await req.user.save()
    res.status(200).json({
      message: 'Added to cart',
      cartItem: {
        qty: Number(qty),
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          countInStock: product.countInStock,
          slug: product.slug,
        },
      },
    })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Remove items from cart
// @router  PUT /api/cart/remove-item-cart/:id-product
// @access  private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id

  if (req.user.cartItems.length <= 0) {
    res.status(400)
    throw new Error('No items on cart')
  }

  const alreadyOnCart = req.user.cartItems.find(
    (item) => item.product.toString() === productId
  )

  if (alreadyOnCart) {
    req.user.cartItems = req.user.cartItems.filter(
      (item) => item.product.toString() !== alreadyOnCart.product.toString()
    )

    //req.user.cartItems = remove.slice()

    await req.user.save()
    res.status(200).json({ message: 'Item Removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Remove all items from cart
// @router  PUT /api/cart/remove-all-item-cart
// @access  private
const removeAllItemFromCart = asyncHandler(async (req, res) => {
  if (req.user.cartItems.length <= 0) {
    res.status(400)
    throw new Error('No items on cart')
  }

  req.user.cartItems = []

  await req.user.save()
  res.status(200).json({ message: 'All Items Removed' })
})

export { addItemToCart, removeItemFromCart, removeAllItemFromCart }
