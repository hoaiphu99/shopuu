import {
  TOTAL_ORDERS,
  TOTAL_ORDERS_RESET,
  TOTAL_ORDERS_WAIT,
  TOTAL_ORDERS_WAIT_RESET,
  TOTAL_USER,
  TOTAL_USER_RESET,
} from '../constants/statisticConstants'

export const statisticTotalOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case TOTAL_ORDERS:
      return { totalOrders: action.payload.data }
    case TOTAL_ORDERS_RESET:
      return {}
    default:
      return state
  }
}

export const statisticTotalOrderWaitReducer = (state = {}, action) => {
  switch (action.type) {
    case TOTAL_ORDERS_WAIT:
      return { totalOrdersWait: action.payload.data }
    case TOTAL_ORDERS_WAIT_RESET:
      return {}
    default:
      return state
  }
}

export const statisticTotalUserReducer = (state = {}, action) => {
  switch (action.type) {
    case TOTAL_USER:
      return { totalUsers: action.payload.data }
    case TOTAL_USER_RESET:
      return {}
    default:
      return state
  }
}
