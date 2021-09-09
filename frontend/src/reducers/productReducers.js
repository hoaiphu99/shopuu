import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_RESET,
  PRODUCT_DETAILS_RESET,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_RESET,
  PRODUCT_UPDATE_DISCOUNT_SUCCESS,
  PRODUCT_UPDATE_DISCOUNT_FAIL,
  PRODUCT_UPDATE_DISCOUNT_REQUEST,
  PRODUCT_UPDATE_DISCOUNT_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_DISCOUNT_REQUEST,
  PRODUCT_DISCOUNT_SUCCESS,
  PRODUCT_DISCOUNT_FAIL,
  PRODUCT_TOP_BUY_REQUEST,
  PRODUCT_TOP_BUY_SUCCESS,
  PRODUCT_TOP_BUY_FAIL,
  PRODUCT_BEST_SELLER_REQUEST,
  PRODUCT_BEST_SELLER_SUCCESS,
  PRODUCT_BEST_SELLER_FAIL,
  PRODUCT_BY_CATEGORY_REQUEST,
  PRODUCT_BY_CATEGORY_SUCCESS,
  PRODUCT_BY_CATEGORY_FAIL,
  PRODUCT_ALL_REQUEST,
  PRODUCT_ALL_SUCCESS,
  PRODUCT_ALL_FAIL,
  PRODUCT_ALL_RESET,
} from '../constants/productConstants'

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.data.products,
        pages: action.payload.data.pages,
        page: action.payload.data.page,
      }
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload.errors }
    default:
      return state
  }
}

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true }
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload.data }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_DELETE_RESET:
      return {}
    default:
      return state
  }
}

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload.data }
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_UPDATE_RESET:
      return { product: {} }
    default:
      return state
  }
}

export const productUpdateDiscountReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_DISCOUNT_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_DISCOUNT_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_UPDATE_DISCOUNT_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_UPDATE_DISCOUNT_RESET:
      return {}
    default:
      return state
  }
}

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_CREATE_REVIEW_RESET:
      return {}
    default:
      return state
  }
}

export const productTopRatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_TOP_SUCCESS:
      return { loading: false, products: action.payload.data }
    case PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload.errors }

    default:
      return state
  }
}

export const productDiscountReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_DISCOUNT_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_DISCOUNT_SUCCESS:
      return { loading: false, products: action.payload.data }
    case PRODUCT_DISCOUNT_FAIL:
      return { loading: false, error: action.payload.errors }

    default:
      return state
  }
}

export const productTopBuyReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_TOP_BUY_REQUEST:
      return { loading: true }
    case PRODUCT_TOP_BUY_SUCCESS:
      return { loading: false, dataTopBuy: action.payload.data }
    case PRODUCT_TOP_BUY_FAIL:
      return { loading: false, error: action.payload.errors }
    default:
      return state
  }
}

export const productBestSellerReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_BEST_SELLER_REQUEST:
      return { loading: true }
    case PRODUCT_BEST_SELLER_SUCCESS:
      return { loading: false, dataBestSeller: action.payload.data }
    case PRODUCT_BEST_SELLER_FAIL:
      return { loading: false, error: action.payload.errors }
    default:
      return state
  }
}

export const productByCategoryReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_BY_CATEGORY_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_BY_CATEGORY_SUCCESS:
      return { loading: false, products: action.payload.data }
    case PRODUCT_BY_CATEGORY_FAIL:
      return { loading: false, error: action.payload.errors }

    default:
      return state
  }
}

export const productAllReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_ALL_REQUEST:
      return { loading: true }
    case PRODUCT_ALL_SUCCESS:
      return { loading: false, products: action.payload.data }
    case PRODUCT_ALL_FAIL:
      return { loading: false, error: action.payload.errors }
    case PRODUCT_ALL_RESET:
      return {}

    default:
      return state
  }
}
