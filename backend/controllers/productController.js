import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Fetch all product with page
// [GET] /api/products
// public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.page) || 1

  const query = {}
  req.query.keyword
    ? (query.name = {
        $regex: req.query.keyword,
        $options: 'i',
      })
    : query
  req.query.category ? (query.category = req.query.category) : query
  req.query.brand ? (query.brand = req.query.brand) : query
  try {
    const count = await Product.countDocuments({ ...query })
    const products = await Product.find({ ...query })
      .populate([
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' },
      ])
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: 'desc' })

    res.json({
      status: 'success',
      data: { products, page, pages: Math.ceil(count / pageSize) },
      errors: null,
    })
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Fetch all product by category
// [GET] /api/products/category/:slug
// public
const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const pageSize = 8
    const category = await Category.findOne({ slug: req.params.slug })
    const products = await Product.find({ category: category._id })
      .populate([
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' },
      ])
      .limit(pageSize)
      .sort({ createdAt: 'desc' })

    res.json({
      status: 'success',
      data: products,
      errors: null,
    })
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Fetch all product
// [GET] /api/products
// public
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate([
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' },
      ])
      .sort({ createdAt: 'desc' })
    res.json({ status: 'success', data: products, errors: null })
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Get product by id
// [GET] /api/products/:id
// public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ])

    if (product) {
      res.json({ status: 'success', data: product, errors: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)

    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Get product by slug
// [GET] /api/products/:slug
// public
const getProductBySlug = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })

    if (product) {
      res.json({ status: 'success', data: product })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})
// Delete product
// [DELETE] /api/products/:id
// private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await product.delete()
      res.status(200).json({ status: 'success', message: 'Đã xóa sản phẩm!' })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Force Delete product
// [DELETE] /api/products/:id/force
// private/admin
const forceDeleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOneWithDeleted({ _id: req.params.id })

    if (product) {
      await product.deleteOne()
      res.json({ status: 'success', message: 'Đã xóa sản phẩm vĩnh viễn!' })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Create product
// [POST] /api/products
// private/admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      user: req.user._id,
      name: req.body.name,
      price: req.body.price,
      images: req.body.images,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
    })

    const createProduct = await product.save()
    res
      .status(201)
      .json({ status: 'success', data: createProduct, errors: null })
  } catch (error) {
    // const errors = customErrorHandler(error, res)
    res.status(400)
    throw new Error(error)
    // .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Update product
// [PUT] /api/products/:id
// private/admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } =
      req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name || product.name
      product.price = price || product.price
      product.description = description || product.description
      product.image = image || product.image
      product.brand = brand || product.brand
      product.category = category || product.category
      product.countInStock = countInStock || product.countInStock

      const updateProduct = await product.save()
      res
        .status(200)
        .json({ status: 'success', data: updateProduct, errors: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Create new review
// [POST] /api/products/:id/review
// private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      // const alreadyReviewed = product.reviews.find(
      //   (r) => r.user.toString() === req.user._id.toString()
      // )

      // if (alreadyReviewed) {
      //   res.status(400)
      //   throw new Error('Already reviewed this product')
      // }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)

      product.numberReviews = product.reviews.length
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(200).json({
        status: 'success',
        message: 'Đã đánh giá sản phẩm!',
        errors: null,
      })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', message: null, errors: errors.message })
  }
})

// Get top rated products
// [GET] /api/products/top
// public
const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate([
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' },
      ])
      .sort({ rating: -1 })
      .limit(3)

    res.json({ status: 'success', data: products, errors: null })
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

export {
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
}
