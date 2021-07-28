import axios from 'axios'
import {
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_CREATE_REQUEST,
  BRAND_CREATE_SUCCESS,
  BRAND_CREATE_FAIL,
  BRAND_UPDATE_REQUEST,
  BRAND_UPDATE_SUCCESS,
  BRAND_UPDATE_FAIL,
  BRAND_DELETE_REQUEST,
  BRAND_DELETE_SUCCESS,
  BRAND_DELETE_FAIL,
} from '../constants/brandConstants'

const listBrands = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_LIST_REQUEST })

    const { data } = await axios.get('/api/brands')

    dispatch({ type: BRAND_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: BRAND_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

const createBrand = (brand) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/brands`, brand, config)

    dispatch({ type: BRAND_CREATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: BRAND_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

const updateBrand = (id, brand) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/brands/${id}`, brand, config)

    dispatch({ type: BRAND_UPDATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: BRAND_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

const deleteBrand = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/brands/${id}`, config)

    dispatch({ type: BRAND_DELETE_SUCCESS })
  } catch (error) {
    dispatch({
      type: BRAND_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export { listBrands, createBrand, updateBrand, deleteBrand }
