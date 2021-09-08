import {
  IMPORT_LIST_REQUEST,
  IMPORT_LIST_SUCCESS,
  IMPORT_LIST_FAIL,
  IMPORT_LIST_RESET,
  IMPORT_DETAILS_REQUEST,
  IMPORT_DETAILS_SUCCESS,
  IMPORT_DETAILS_FAIL,
  IMPORT_DETAILS_RESET,
  IMPORT_CREATE_SUCCESS,
  IMPORT_CREATE_FAIL,
  IMPORT_CREATE_REQUEST,
  IMPORT_CREATE_RESET,
  IMPORT_STATUS_SUCCESS,
  IMPORT_STATUS_FAIL,
  IMPORT_STATUS_REQUEST,
  IMPORT_STATUS_RESET,
} from '../constants/importConstants'

export const importListReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_LIST_REQUEST:
      return { loading: true }
    case IMPORT_LIST_SUCCESS:
      return { loading: false, imports: action.payload.data }
    case IMPORT_LIST_FAIL:
      return { loading: false, error: action.payload }
    case IMPORT_LIST_RESET:
      return {}
    default:
      return state
  }
}

export const importDetailsReducer = (state = { importOrder: {} }, action) => {
  switch (action.type) {
    case IMPORT_DETAILS_REQUEST:
      return { ...state, loading: true }
    case IMPORT_DETAILS_SUCCESS:
      return { loading: false, importOrder: action.payload.data }
    case IMPORT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case IMPORT_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const importCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_CREATE_REQUEST:
      return { loading: true }
    case IMPORT_CREATE_SUCCESS:
      return { loading: false, success: true }
    case IMPORT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case IMPORT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const importOrderStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STATUS_REQUEST:
      return { loading: true }

    case IMPORT_STATUS_SUCCESS:
      return {
        loading: false,
        success: true,
      }

    case IMPORT_STATUS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case IMPORT_STATUS_RESET:
      return {}

    default:
      return state
  }
}
