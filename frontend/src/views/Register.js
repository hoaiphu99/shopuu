import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formItemLayout, tailFormItemLayout } from '../constants/formConstants'

import { register } from '../actions/userActions'
import { USER_REGISTER_RESET } from '../constants/userConstants'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  Typography,
  message,
} from 'antd'

const Register = ({ location, history }) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [form] = Form.useForm()
  const { Option } = Select
  const { Title } = Typography

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : ''

  const key = 'register'

  useEffect(() => {
    const getProvinces = async () => {
      const { data } = await axios.get('https://vapi.vnappmob.com/api/province')
      setProvinces(data.results)
    }
    getProvinces()

    if (userInfo) {
      message.success({ content: 'Register success!', key, duration: 2 })
      dispatch({ type: USER_REGISTER_RESET })
      setTimeout(() => {
        history.push(redirect)
      }, 2000)
    }
  }, [history, userInfo, redirect])

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
    const city = provinces.find((item) => item.province_id === values.city)
    const district = districts.find(
      (item) => item.district_id === values.district
    )
    const ward = wards.find((item) => item.ward_id === values.ward)

    const data = {
      email: values.email,
      password: values.password,
      name: values.name,
      phone: values.phone,
      shippingAddress: {
        address: values.address,
        city: city.province_name,
        district: district.district_name,
        ward: ward.ward_name,
      },
    }

    if (data.password.length < 6) {
    } else {
      dispatch(register(data))
    }
  }

  return (
    <>
      <Row justify='center'>
        <Col span={3}>
          <Title>Sign Up</Title>
        </Col>
      </Row>
      <Row justify='center'>
        {loading && message.loading('Register...', key)}
        {error && message.error({ content: `${error}`, key, duration: 2 })}
        <Col span={8} pull={2}>
          <Form
            onValuesChange={onValuesChange}
            {...formItemLayout}
            form={form}
            name='register'
            onFinish={submitHandler}
            scrollToFirstError>
            <Form.Item
              name='email'
              label='E-mail'
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback>
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='Confirm Password'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    )
                  },
                }),
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='name'
              label='Name'
              tooltip='What do you want others to call you?'
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                  whitespace: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item name='phone' label='Phone Number'>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='address'
              label='Address'
              tooltip='Your address for delivery orders'>
              <Input />
            </Form.Item>

            <Form.Item name='city' label='City'>
              <Select placeholder='select your city'>
                {provinces &&
                  provinces.map((p) => (
                    <Option key={p.province_id} value={p.province_id}>
                      {p.province_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name='district' label='District'>
              <Select placeholder='select your district'>
                {districts &&
                  districts.map((d) => (
                    <Option key={d.district_id} value={d.district_id}>
                      {d.district_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name='ward' label='Ward'>
              <Select placeholder='select your ward'>
                {wards &&
                  wards.map((w) => (
                    <Option key={w.ward_id} value={w.ward_id}>
                      {w.ward_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='agreement'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
              {...tailFormItemLayout}>
              <Checkbox>
                I have read the <a href=''>agreement</a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit'>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Register
