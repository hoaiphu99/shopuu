import {
  TOTAL_ORDERS,
  TOTAL_ORDERS_RESET,
  TOTAL_ORDERS_WAIT,
  TOTAL_ORDERS_WAIT_RESET,
  SALES,
  SALES_RESET,
} from '../constants/statisticConstants'

export const statisticReducer = (state = {}, action) => {
  switch (action.type) {
    case SALES:
      return { sales: action.payload.data }
    case SALES_RESET:
      return {}
    case TOTAL_ORDERS:
      return { totalOrders: action.payload.data }
    case TOTAL_ORDERS_RESET:
      return {}
    case TOTAL_ORDERS_WAIT:
      return { totalOrdersWait: action.payload.data }
    case TOTAL_ORDERS_WAIT_RESET:
      return {}
    default:
      return state
  }
}
