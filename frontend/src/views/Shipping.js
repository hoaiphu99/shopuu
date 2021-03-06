import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../constants/formConstants'
import { Row, Col, Form, Input, Select, Button, message, Divider } from 'antd'

const Shipping = ({ history }) => {
  const [form] = Form.useForm()
  const { Option } = Select

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    const getProvinces = async () => {
      const { data } = await axios.get('https://vapi.vnappmob.com/api/province')
      setProvinces(data.results)
    }
    getProvinces()
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'))
      }
    }
  }, [dispatch, history, userInfo, user])

  const getDistricts = async (city) => {
    try {
      const { data } = await axios.get(
        `https://vapi.vnappmob.com/api/province/district/${city}`
      )
      setDistricts(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const getWards = async (district) => {
    try {
      const { data } = await axios.get(
        `https://vapi.vnappmob.com/api/province/ward/${district}`
      )
      setWards(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const onValuesChange = (changedValues) => {
    if (changedValues.city) getDistricts(changedValues.city)
    if (changedValues.district) getWards(changedValues.district)
  }

  const submitHandler = (values) => {
    const city =
      provinces.find((item) => item.province_id === values.city) ||
      user.shippingAddress.city

    const district =
      districts.find((item) => item.district_id === values.district) ||
      user.shippingAddress.district

    const ward =
      wards.find((item) => item.ward_id === values.ward) ||
      user.shippingAddress.ward

    const data = {
      id: userInfo._id,
      phone: values.phone,
      shippingAddress: {
        address: values.address,
        city: city.province_name || user.shippingAddress.city,
        district: district.district_name || user.shippingAddress.district,
        ward: ward.ward_name || user.shippingAddress.ward,
      },
    }

    dispatch(updateUserProfile(data))
    history.push('/payment')
  }

  // const submitHandler = (e) => {
  //   e.preventDefault()
  //   dispatch(saveShippingAddress({ address, city, postalCode, country }))
  //   history.push('/payment')
  // }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        user &&
        user.name && (
          <>
            <Row>
              <Col span={16} offset={4}>
                <CheckoutSteps step1 step2 />
                <Divider />
              </Col>
            </Row>
            <Row>
              <Col span={12} offset={6}>
                <Form
                  onValuesChange={onValuesChange}
                  {...formItemLayoutDetails}
                  form={form}
                  name='register'
                  onFinish={submitHandler}
                  scrollToFirstError>
                  <Form.Item
                    name='phone'
                    initialValue={user.phone}
                    label='S??? ??i???n tho???i'
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng nh???p s??? ??i???n tho???i!',
                      },
                    ]}>
                    <Input style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name='address'
                    initialValue={user.shippingAddress.address}
                    label='?????a ch???'
                    tooltip='?????a ch??? ????? ch??ng t??i giao h??ng cho b???n'
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng nh???p ?????a ch???!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name='city'
                    initialValue={user.shippingAddress.city}
                    label='T???nh/Th??nh ph???'
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng ch???n T???nh/Th??nh ph???!',
                      },
                    ]}>
                    <Select placeholder='Ch???n T???nh/Th??nh ph???'>
                      {provinces &&
                        provinces.map((p) => (
                          <Option key={p.province_id} value={p.province_id}>
                            {p.province_name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name='district'
                    initialValue={user.shippingAddress.district}
                    label='Qu???n/Huy???n'
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng ch???n qu???n huy???n!',
                      },
                    ]}>
                    <Select placeholder='Ch???n Qu???n/Huy???n'>
                      {districts &&
                        districts.map((d) => (
                          <Option key={d.district_id} value={d.district_id}>
                            {d.district_name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name='ward'
                    initialValue={user.shippingAddress.ward}
                    label='X??/Ph?????ng'
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng ch???n X??/Ph?????ng!',
                      },
                    ]}>
                    <Select placeholder='Ch???n X??/Ph?????ng'>
                      {wards &&
                        wards.map((w) => (
                          <Option key={w.ward_id} value={w.ward_id}>
                            {w.ward_name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...tailFormItemLayoutDetails}>
                    <Button type='primary' htmlType='submit'>
                      Ti???p t???c
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  )
}

export default Shipping
