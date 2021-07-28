import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_RESET,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_UPDATE_RESET,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_DELETE_RESET,
} from '../constants/categoryConstants'

export const categoryListReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true }
      break
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, categories: action.payload }
      break
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload }
      break
    default:
      return state
      break
  }
}

export const categoryCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_CREATE_REQUEST:
      return { loading: true }
      break
    case CATEGORY_CREATE_SUCCESS:
      return { loading: false, success: true, category: action.payload }
      break
    case CATEGORY_CREATE_FAIL:
      return { loading: false, error: action.payload }
      break
    case CATEGORY_CREATE_RESET:
      return {}
      break
    default:
      return state
      break
  }
}

export const categoryUpdateReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case CATEGORY_UPDATE_REQUEST:
      return { loading: true }
      break
    case CATEGORY_UPDATE_SUCCESS:
      return { loading: false, success: true, category: action.payload }
      break
    case CATEGORY_UPDATE_FAIL:
      return { loading: false, error: action.payload }
      break
    case CATEGORY_UPDATE_RESET:
      return { category: {} }
      break
    default:
      return state
      break
  }
}

export const categoryDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_DELETE_REQUEST:
      return { loading: true }
      break
    case CATEGORY_DELETE_SUCCESS:
      return { loading: false, success: true }
      break
    case CATEGORY_DELETE_FAIL:
      return { loading: false, error: action.payload }
      break
    case CATEGORY_DELETE_RESET:
      return {}
      break
    default:
      return state
      break
  }
}
