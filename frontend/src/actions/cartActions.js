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
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
        slug: data.slug,
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

export const removeAllFromCart = (id) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  await axios.put(`/api/cart/remove-all-item-cart`, {}, config)

  dispatch({ type: CART_MY_RESET })
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
