import axios from 'axios'
import {
  WISHLIST_MY,
  WISHLIST_REMOVE_ALL_ITEM,
  WISHLIST_ADD_ITEM,
  WISHLIST_REMOVE_ITEM,
} from '../constants/wishlistConstants'
import ReactSession from 'react-client-session'

export const getMyWishlist = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  const { data } = await axios.get(`/api/wishlist`, config)

  dispatch({
    type: WISHLIST_MY,
    payload: data,
  })

  localStorage.setItem(
    `wishlistItems@${userInfo._id}`,
    JSON.stringify(getState().wishlist.wishlistItems)
  )
}

export const addToWishlist = (id) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  const { data } = await axios.put(
    `/api/wishlist/add-to-wishlist/${id}`,
    {},
    config
  )

  dispatch({
    type: WISHLIST_ADD_ITEM,
    payload: data,
  })

  localStorage.setItem(
    `wishlistItems@${userInfo._id}`,
    JSON.stringify(getState().wishlist.wishlistItems)
  )
}

export const removeFromWishlist = (id) => async (dispatch, getState) => {

  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  await axios.put(`/api/wishlist/remove-item-wishlist/${id}`, {}, config)

  dispatch({
    type: WISHLIST_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem(
    `wishlistItems@${userInfo._id}`,
    JSON.stringify(getState().wishlist.wishlistItems)
  )
}

export const removeAllFromWishList = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  await axios.put(`/api/wishlist/remove-all-item-wishlist`, {}, config)

  dispatch({ type: WISHLIST_REMOVE_ALL_ITEM })

  localStorage.setItem(
    `wishlistItems@${userInfo._id}`,
    JSON.stringify(getState().wishlist.wishlistItems)
  )
}
