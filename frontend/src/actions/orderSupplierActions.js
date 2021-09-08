import axios from 'axios'
import {
  ORDER_SUPPLIER_LIST_REQUEST,
  ORDER_SUPPLIER_LIST_SUCCESS,
  ORDER_SUPPLIER_LIST_FAIL,
  ORDER_SUPPLIER_LIST_RESET,
  ORDER_SUPPLIER_DETAILS_REQUEST,
  ORDER_SUPPLIER_DETAILS_SUCCESS,
  ORDER_SUPPLIER_DETAILS_FAIL,
  ORDER_SUPPLIER_CREATE_SUCCESS,
  ORDER_SUPPLIER_CREATE_FAIL,
  ORDER_SUPPLIER_CREATE_REQUEST,
  ORDER_SUPPLIER_STATUS_SUCCESS,
  ORDER_SUPPLIER_STATUS_FAIL,
  ORDER_SUPPLIER_STATUS_REQUEST,
} from '../constants/orderSupplierConstants'

export const listOrderSuppliers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_SUPPLIER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/order-suppliers`, config)

    dispatch({
      type: ORDER_SUPPLIER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_SUPPLIER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getOrderSupplierDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_SUPPLIER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/order-suppliers/${id}`, config)

    dispatch({
      type: ORDER_SUPPLIER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_SUPPLIER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createOrderSupplier =
  (orderSupplier) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_SUPPLIER_CREATE_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        `/api/order-suppliers`,
        orderSupplier,
        config
      )

      dispatch({
        type: ORDER_SUPPLIER_CREATE_SUCCESS,
        payload: data,
      })
      dispatch({
        type: ORDER_SUPPLIER_LIST_RESET,
      })
    } catch (error) {
      dispatch({
        type: ORDER_SUPPLIER_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const statusOrderSupplier =
  (orderSupplierId, status) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_SUPPLIER_STATUS_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/order-suppliers/${orderSupplierId}/status?stt=${status}`,
        {},
        config
      )

      dispatch({
        type: ORDER_SUPPLIER_STATUS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: ORDER_SUPPLIER_STATUS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
