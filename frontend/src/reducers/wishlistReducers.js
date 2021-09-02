import {
  WISHLIST_MY,
  WISHLIST_ADD_ITEM,
  WISHLIST_REMOVE_ITEM,
  WISHLIST_REMOVE_ALL_ITEM,
} from '../constants/wishlistConstants'

export const wishlistReducer = (state = { wishlistItems: [] }, action) => {
  switch (action.type) {
    case WISHLIST_MY:
      return {
        wishlistItems: action.payload.data,
      }

    case WISHLIST_REMOVE_ALL_ITEM:
      return {
        wishlistItems: [],
      }

    case WISHLIST_ADD_ITEM:
      const item = action.payload.data
      const existItem = state.wishlistItems.find(
        (i) => i.product._id === item.product._id
      )

      if (existItem) {
        return {
          ...state,
          wishlistItems: state.wishlistItems.map((i) =>
            i.product._id === existItem.product._id ? item : i
          ),
        }
      } else {
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, item],
        }
      }

    case WISHLIST_REMOVE_ITEM:
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (i) => i.product._id !== action.payload
        ),
      }

    default:
      return state
  }
}
