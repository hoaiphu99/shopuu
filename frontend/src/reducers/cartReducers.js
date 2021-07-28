import {
  CART_MY,
  CART_MY_RESET,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_MY:
      return {
        cartItems: action.payload,
      }
      break
    case CART_MY_RESET:
      //localStorage.removeItem('cartItems')
      return {
        cartItems: [],
        shippingAddress: {},
      }
      break
    case CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find((i) => i.product === item.product)

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === existItem.product ? item : i
          ),
        }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }
      break
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      }
      break
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }
      break
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
      break
    default:
      return state
      break
  }
}
