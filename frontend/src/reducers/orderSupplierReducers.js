import {
  ORDER_SUPPLIER_LIST_REQUEST,
  ORDER_SUPPLIER_LIST_SUCCESS,
  ORDER_SUPPLIER_LIST_FAIL,
  ORDER_SUPPLIER_LIST_RESET,
  ORDER_SUPPLIER_DETAILS_REQUEST,
  ORDER_SUPPLIER_DETAILS_SUCCESS,
  ORDER_SUPPLIER_DETAILS_FAIL,
  ORDER_SUPPLIER_DETAILS_RESET,
  ORDER_SUPPLIER_CREATE_SUCCESS,
  ORDER_SUPPLIER_CREATE_FAIL,
  ORDER_SUPPLIER_CREATE_REQUEST,
  ORDER_SUPPLIER_CREATE_RESET,
  ORDER_SUPPLIER_STATUS_SUCCESS,
  ORDER_SUPPLIER_STATUS_FAIL,
  ORDER_SUPPLIER_STATUS_REQUEST,
  ORDER_SUPPLIER_STATUS_RESET,
} from '../constants/orderSupplierConstants'

export const orderSupplierListReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_SUPPLIER_LIST_REQUEST:
      return { loading: true }
    case ORDER_SUPPLIER_LIST_SUCCESS:
      return { loading: false, orderSuppliers: action.payload.data }
    case ORDER_SUPPLIER_LIST_FAIL:
      return { loading: false, error: action.payload.errors }
    case ORDER_SUPPLIER_LIST_RESET:
      return {}
    default:
      return state
  }
}

export const orderSupplierDetailsReducer = (
  state = { orderSupplier: {} },
  action
) => {
  switch (action.type) {
    case ORDER_SUPPLIER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case ORDER_SUPPLIER_DETAILS_SUCCESS:
      return { loading: false, orderSupplier: action.payload.data }
    case ORDER_SUPPLIER_DETAILS_FAIL:
      return { loading: false, error: action.payload.errors }
    case ORDER_SUPPLIER_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const orderSupplierCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_SUPPLIER_CREATE_REQUEST:
      return { loading: true }
    case ORDER_SUPPLIER_CREATE_SUCCESS:
      return { loading: false, success: true }
    case ORDER_SUPPLIER_CREATE_FAIL:
      return { loading: false, error: action.payload.errors }
    case ORDER_SUPPLIER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const orderSupplierStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_SUPPLIER_STATUS_REQUEST:
      return { loading: true }

    case ORDER_SUPPLIER_STATUS_SUCCESS:
      return {
        loading: false,
        success: true,
      }

    case ORDER_SUPPLIER_STATUS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case ORDER_SUPPLIER_STATUS_RESET:
      return {}

    default:
      return state
  }
}
