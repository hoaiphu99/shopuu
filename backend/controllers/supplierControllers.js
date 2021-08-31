import asyncHandler from 'express-async-handler'
import Supplier from '../models/supplierModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Fetch all suppliers
// [GET] /api/suppliers
// private/admin
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({})

  res.json(suppliers)
})

// Create suppliers
// [POST] /api/suppliers
// private/admin
const createSupplier = asyncHandler(async (req, res) => {
  const { name, phone, supplierAddress } = req.body

  try {
    const supplier = await Supplier.create({ name, phone, supplierAddress })
    if (!supplier) {
      res.status(201).json({ status: 'success', data: supplier, errors: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy NCC!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// @desc    Update brands
// @router  PUT /api/brands/:id
// @access  private/admin
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    brand.name = req.body.name || brand.name
    brand.description = req.body.description || brand.description
    const updateBrand = await brand.save()

    res.status(200).json(updateBrand)
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Delete brands
// @router  DELETE /api/brands/:id
// @access  private/admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    const alreadyHaveProducts = await Product.findOne({
      brand: brand._id,
    })
    if (alreadyHaveProducts) {
      res.status(400)
      throw new Error('Brand already have products')
    } else {
      await brand.delete()

      res.status(200).json({ message: 'Brand deleted' })
    }
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Force Delete brands
// @router  DELETE /api/brands/:id/force
// @access  private/admin
const deleteBrandForce = asyncHandler(async (req, res) => {
  const brand = await Brand.findOneWithDeleted({ _id: req.params.id })

  if (brand) {
    await brand.deleteOne()

    res.status(200).json({ message: 'Brand deleted' })
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

export {
  getSuppliers,
  createSupplier,
  updateBrand,
  deleteBrand,
  deleteBrandForce,
}
