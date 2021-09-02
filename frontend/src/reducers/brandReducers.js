import {
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_CREATE_REQUEST,
  BRAND_CREATE_SUCCESS,
  BRAND_CREATE_FAIL,
  BRAND_CREATE_RESET,
  BRAND_UPDATE_REQUEST,
  BRAND_UPDATE_SUCCESS,
  BRAND_UPDATE_FAIL,
  BRAND_UPDATE_RESET,
  BRAND_DELETE_REQUEST,
  BRAND_DELETE_SUCCESS,
  BRAND_DELETE_FAIL,
  BRAND_DELETE_RESET,
} from '../constants/brandConstants'

export const brandListReducer = (state = { brands: [] }, action) => {
  switch (action.type) {
    case BRAND_LIST_REQUEST:
      return { loading: true }

    case BRAND_LIST_SUCCESS:
      return { loading: false, brands: action.payload }

    case BRAND_LIST_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const brandCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BRAND_CREATE_REQUEST:
      return { loading: true }

    case BRAND_CREATE_SUCCESS:
      return { loading: false, success: true, brand: action.payload }

    case BRAND_CREATE_FAIL:
      return { loading: false, error: action.payload }

    case BRAND_CREATE_RESET:
      return {}

    default:
      return state
  }
}

export const brandUpdateReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case BRAND_UPDATE_REQUEST:
      return { loading: true }

    case BRAND_UPDATE_SUCCESS:
      return { loading: false, success: true, brand: action.payload }

    case BRAND_UPDATE_FAIL:
      return { loading: false, error: action.payload }

    case BRAND_UPDATE_RESET:
      return { brand: {} }

    default:
      return state
  }
}

export const brandDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BRAND_DELETE_REQUEST:
      return { loading: true }

    case BRAND_DELETE_SUCCESS:
      return { loading: false, success: true }

    case BRAND_DELETE_FAIL:
      return { loading: false, error: action.payload }

    case BRAND_DELETE_RESET:
      return {}

    default:
      return state
  }
}
