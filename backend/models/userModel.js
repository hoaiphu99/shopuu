import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import mongooseDelete from 'mongoose-delete'
import validator from 'validator'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên!'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu!'],
      minlength: [6, 'Mật khẩu phải từ 6 ký tự trở lên!'],
    },
    phone: {
      type: String,
    },
    shippingAddress: {
      address: { type: String, required: true, default: ' ' },
      city: { type: String, required: true, default: ' ' },
      district: { type: String, required: true, default: ' ' },
      ward: { type: String, required: true, default: ' ' },
    },
    wishListItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
