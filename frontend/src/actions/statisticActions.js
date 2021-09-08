import axios from 'axios'
import {
  TOTAL_ORDERS,
  TOTAL_ORDERS_WAIT,
  SALES,
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
