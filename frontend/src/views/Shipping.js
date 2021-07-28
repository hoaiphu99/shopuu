import React, { useState, useEffect } from 'react'
import axios from 'axios'
//import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
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
              <Col span={12} offset={6}>
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
                    label='Phone Number'>
                    <Input style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name='address'
                    initialValue={user.shippingAddress.address}
                    label='Address'
                    tooltip='Your address for delivery orders'>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name='city'
                    initialValue={user.shippingAddress.city}
                    label='City'>
                    <Select placeholder='select your city'>
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
                    label='District'>
                    <Select placeholder='select your district'>
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
                    label='Ward'>
                    <Select placeholder='select your ward'>
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
                      Continue
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </>
        )
      )}
    </>
    // <FormContainer>
    //   <CheckoutSteps step1 step2></CheckoutSteps>
    //   <h1>Shipping</h1>
    //   <Form onSubmit={submitHandler}>
    //     <Form.Group controlId='address'>
    //       <Form.Label>Address</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter Address'
    //         value={address}
    //         required
    //         onChange={(e) => setAddress(e.target.value)}></Form.Control>
    //     </Form.Group>

    //     <Form.Group controlId='city'>
    //       <Form.Label className='mt-4'>City</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter City'
    //         value={city}
    //         required
    //         onChange={(e) => setCity(e.target.value)}></Form.Control>
    //     </Form.Group>

    //     <Form.Group controlId='postalCode'>
    //       <Form.Label className='mt-4'>Postal Code</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter Postal Code'
    //         value={postalCode}
    //         required
    //         onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
    //     </Form.Group>

    //     <Form.Group controlId='country'>
    //       <Form.Label className='mt-4'>Country</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter Country'
    //         value={country}
    //         required
    //         onChange={(e) => setCountry(e.target.value)}></Form.Control>
    //     </Form.Group>

    //     <Button type='submit' className='btn btn-success mt-2'>
    //       Continue
    //     </Button>
    //   </Form>
    // </FormContainer>
  )
}

export default Shipping
