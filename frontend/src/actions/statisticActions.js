import axios from 'axios'
import {
  TOTAL_ORDERS,
  TOTAL_ORDERS_WAIT,
  TOTAL_USER,
} from '../constants/statisticConstants'

export const getTotalOrders = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  const { data } = await axios.get(`/api/orders/total`, config)

  dispatch({
    type: TOTAL_ORDERS,
    payload: data,
  })
}

export const getTotalOrdersWait = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  const { data } = await axios.get(`/api/orders/total?status=WAIT`, config)

  dispatch({
    type: TOTAL_ORDERS_WAIT,
    payload: data,
  })
}

export const getTotalUser = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  const { data } = await axios.get(`/api/users/total`, config)

  dispatch({
    type: TOTAL_USER,
    payload: data,
  })
}
