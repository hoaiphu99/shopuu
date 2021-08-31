import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @router  POST /api/users/login
// @access  public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email }).populate({
    path: 'wishListItems',
    populate: { path: 'product', select: 'name image slug price countInStock' },
  })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishListItems: user.wishListItems,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Get user profile
// @router  GET /api/users/profile
// @access  private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cartItems',
    populate: { path: 'product', select: 'name image' },
  })

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      cartItems: user.cartItems,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Register new user
// @router  GET /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, phone, shippingAddress } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    phone,
    shippingAddress,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @router  PUT /api/users/profile
// @access  private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, shippingAddress } = req.body
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.shippingAddress = shippingAddress || user.shippingAddress

    const updateUser = await user.save()

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      phone: updateUser.phone,
      shippingAddress: updateUser.shippingAddress,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all user
// @router  GET /api/users
// @access  private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})

  res.json(users)
})

// @desc    Delete user
// @router  DELETE /api/users
// @access  private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User deleted' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by id
// @router  GET /api/users/:id
// @access  private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @router  PUT /api/users/:id
// @access  private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin || user.isAdmin
    user.phone = req.body.phone || user.phone
    user.shippingAddress = req.body.shippingAddress || user.shippingAddress

    const updateUser = await user.save()

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      phone: updateUser.phone,
      shippingAddress: updateUser.shippingAddress,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
