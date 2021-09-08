import axios from 'axios'
import {
  IMPORT_LIST_REQUEST,
  IMPORT_LIST_SUCCESS,
  IMPORT_LIST_FAIL,
  IMPORT_LIST_RESET,
  IMPORT_DETAILS_REQUEST,
  IMPORT_DETAILS_SUCCESS,
  IMPORT_DETAILS_FAIL,
  IMPORT_CREATE_SUCCESS,
  IMPORT_CREATE_FAIL,
  IMPORT_CREATE_REQUEST,
  IMPORT_STATUS_SUCCESS,
  IMPORT_STATUS_FAIL,
  IMPORT_STATUS_REQUEST,
} from '../constants/importConstants'

export const listImportOrder = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: IMPORT_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/imports`, config)

    dispatch({
      type: IMPORT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: IMPORT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getImportOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: IMPORT_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/imports/${id}`, config)

    dispatch({
      type: IMPORT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: IMPORT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createImport = (importData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: IMPORT_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/imports`, importData, config)

    dispatch({
      type: IMPORT_CREATE_SUCCESS,
      payload: data,
    })
    dispatch({
      type: IMPORT_LIST_RESET,
    })
  } catch (error) {
    dispatch({
      type: IMPORT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const statusImportOrder =
  (importId, status) => async (dispatch, getState) => {
    try {
      dispatch({
        type: IMPORT_STATUS_REQUEST,
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
        `/api/imports/${importId}/status?stt=${status}`,
        {},
        config
      )

      dispatch({
        type: IMPORT_STATUS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: IMPORT_STATUS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
