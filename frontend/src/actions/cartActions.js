import axios from 'axios'
import {
  CART_MY_RESET,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'
import ReactSession from 'react-client-session'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`)

  if (data) {
    const { data: product } = data
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
        slug: product.slug,
      },
    })

    const {
      userLogin: { userInfo },
    } = getState()

    localStorage.setItem(
      `cartItems@${userInfo._id}`,
      JSON.stringify(getState().cart.cartItems)
    )
  }
}

export const removeFromCart = (id) => async (dispatch, getState) => {
  // const {
  //   userLogin: { userInfo },
  // } = getState()

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${userInfo.token}`,
  //   },
  // }

  //await axios.put(`/api/cart/remove-item-cart/${id}`, {}, config)

  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  const {
    userLogin: { userInfo },
  } = getState()

  localStorage.setItem(
    `cartItems@${userInfo._id}`,
    JSON.stringify(getState().cart.cartItems)
  )
}

export const removeAllFromCart = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  dispatch({ type: CART_MY_RESET })
  localStorage.setItem(
    `cartItems@${userInfo._id}`,
    JSON.stringify(getState().cart.cartItems)
  )
}
export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
