import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productByCategoryReducer,
  productAllReducer,
  productTopBuyReducer,
  productBestSellerReducer,
  productUpdateDiscountReducer,
  productDiscountReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { wishlistReducer } from './reducers/wishlistReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userChangePasswordReducer,
} from './reducers/userReducers'
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderStatusReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from './reducers/orderReducers'
import {
  categoryListReducer,
  categoryCreateReducer,
  categoryUpdateReducer,
  categoryDeleteReducer,
} from './reducers/categoryReducers'
import {
  brandListReducer,
  brandCreateReducer,
  brandUpdateReducer,
  brandDeleteReducer,
} from './reducers/brandReducers'
import {
  statisticTotalOrderReducer,
  statisticTotalOrderWaitReducer,
  statisticTotalUserReducer,
} from './reducers/statisticReducers'
import {
  supplierListReducer,
  supplierDetailsReducer,
  supplierUpdateReducer,
  supplierDeleteReducer,
} from './reducers/supplierReducers'
import {
  orderSupplierCreateReducer,
  orderSupplierListReducer,
  orderSupplierDetailsReducer,
  orderSupplierStatusReducer,
} from './reducers/orderSupplierReducers'
import {
  importCreateReducer,
  importListReducer,
  importDetailsReducer,
  importOrderStatusReducer,
} from './reducers/importReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productUpdateDiscount: productUpdateDiscountReducer,
  productDelete: productDeleteReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  productDiscount: productDiscountReducer,
  productByCategory: productByCategoryReducer,
  productAll: productAllReducer,
  productTopBuy: productTopBuyReducer,
  productBestSeller: productBestSellerReducer,

  cart: cartReducer,
  wishlist: wishlistReducer,

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userChangePassword: userChangePasswordReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderStatus: orderStatusReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,

  categoryList: categoryListReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,

  brandList: brandListReducer,
  brandCreate: brandCreateReducer,
  brandUpdate: brandUpdateReducer,
  brandDelete: brandDeleteReducer,

  statisticTotalOrder: statisticTotalOrderReducer,
  statisticTotalOrderWait: statisticTotalOrderWaitReducer,
  statisticTotalUser: statisticTotalUserReducer,

  supplierList: supplierListReducer,
  supplierDetails: supplierDetailsReducer,
  supplierUpdate: supplierUpdateReducer,
  supplierDelete: supplierDeleteReducer,

  orderSupplierCreate: orderSupplierCreateReducer,
  orderSupplierList: orderSupplierListReducer,
  orderSupplierDetails: orderSupplierDetailsReducer,
  orderSupplierStatus: orderSupplierStatusReducer,

  importCreate: importCreateReducer,
  importList: importListReducer,
  importDetails: importDetailsReducer,
  importOrderStatus: importOrderStatusReducer,
})
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const cartItemsFromStorage =
  localStorage.getItem('userInfo') &&
  localStorage.getItem(
    `cartItems@${JSON.parse(localStorage.getItem('userInfo'))._id}`
  )
    ? JSON.parse(
        localStorage.getItem(
          `cartItems@${JSON.parse(localStorage.getItem('userInfo'))._id}`
        )
      )
    : []

const wishlistItemsFromStorage =
  localStorage.getItem('userInfo') &&
  localStorage.getItem(
    `wishlistItems@${JSON.parse(localStorage.getItem('userInfo'))._id}`
  )
    ? JSON.parse(
        localStorage.getItem(
          `wishlistItems@${JSON.parse(localStorage.getItem('userInfo'))._id}`
        )
      )
    : []

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: {},
    paymentMethod: localStorage.getItem('paymentMethod'),
  },
  wishlist: {
    wishlistItems: wishlistItemsFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
