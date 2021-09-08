import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// Auth user & get token
// [POST] /api/users/login
// public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email }).populate({
    path: 'wishListItems',
    populate: { path: 'product', select: 'name image slug price countInStock' },
  })

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishListItems: user.wishListItems,
      token: token,
    })
  } else {
    res.status(401)
    throw new Error('Email hoặc mật khẩu không đúng')
  }
})

// Get user profile
// [GET] /api/users/profile
// private
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

// Register new user
// [GET] /api/users
// Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, phone, shippingAddress } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400)
    throw new Error('Email này đã được đăng ký!')
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

// Update user profile
// [PUT] /api/users/profile
// private
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

// Get all user
// [GET] /api/users
// private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: 'desc' })

  res.json(users)
})

// Delete user
// [DELETE] /api/users
// private/admin
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

// Get user by id
// [GET] /api/users/:id
// private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Update user
// [PUT] /api/users/:id
// private/admin
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

// Change password
// [PUT] /api/users/change-password
// Private
const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      if (await user.matchPassword(password)) {
        user.password = newPassword
        await user.save()

        res.status(200).json({
          successCode: 'success',
          message: 'Đổi mật khẩu thành công!',
          errorCode: null,
        })
      }
      res.status(400)
      throw new Error('Mật khẩu cũ không đúng!')
    } else {
      res.status(404)
      throw new Error('Không tìm thấy người dùng này!')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Total user
// [GET] /api/users/total
// Private/admin
const totalUser = asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ isAdmin: false })
    res
      .status(200)
      .json({ successCode: 'success', data: count, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
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
  changePassword,
  totalUser,
}
