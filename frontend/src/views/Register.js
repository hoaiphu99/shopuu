import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
      message.success({ content: 'Đăng ký thành công!', key, duration: 2 })
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
    const city =
      provinces.find((item) => item.province_id === values.city) || ''
    const district =
      districts.find((item) => item.district_id === values.district) || ''
    const ward = wards.find((item) => item.ward_id === values.ward) || ''

    const data = {
      email: values.email,
      password: values.password,
      name: values.name,
      phone: values.phone || '',
      shippingAddress: {
        address: values.address || '',
        city: city.province_name,
        district: district.district_name,
        ward: ward.ward_name,
      },
    }

    if (data.password.length < 6) {
      message.error({
        content: 'Mật khẩu từ 6 ký tự trở lên!',
        key,
        duration: 2,
      })
    } else {
      dispatch(register(data))
    }
  }

  return (
    <>
      <Row justify='center'>
        <Col span={8}>
          <Title>Đăng ký tài khoản</Title>
        </Col>
      </Row>
      <Row justify='center'>
        {loading && message.loading('Đang tạo tài khoản...', key)}
        {error && message.error({ content: `${error}`, key, duration: 2 })}
        <Col span={10} pull={2}>
          <Form
            onValuesChange={onValuesChange}
            {...formItemLayout}
            form={form}
            name='register'
            onFinish={submitHandler}
            scrollToFirstError>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },
                {
                  required: true,
                  message: 'Vui lòng nhập Email!',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='password'
              label='Mật khẩu'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
                () => ({
                  validator(_, value) {
                    if (!value || value.length >= 6) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('Mật khẩu từ 6 ký tự trở lên!')
                    )
                  },
                }),
              ]}
              hasFeedback>
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='Nhập lại mật khẩu'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'))
                  },
                }),
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='name'
              label='Họ & Tên'
              tooltip='Chúng tôi có thể gọi bạn là gì?'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ tên!',
                  whitespace: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item name='phone' label='Số điện thoại'>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='address'
              label='Địa chỉ'
              tooltip='Địa chỉ để chúng tôi giao hàng cho bạn'>
              <Input />
            </Form.Item>

            <Form.Item name='city' label='Tỉnh/Thành phố'>
              <Select placeholder='Chọn Tỉnh/Thành phố'>
                {provinces &&
                  provinces.map((p) => (
                    <Option key={p.province_id} value={p.province_id}>
                      {p.province_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name='district' label='Quận/Huyện'>
              <Select placeholder='Chọn Quận/Huyện'>
                {districts &&
                  districts.map((d) => (
                    <Option key={d.district_id} value={d.district_id}>
                      {d.district_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name='ward' label='Xã/Phường'>
              <Select placeholder='Chọn Xã/Phường'>
                {wards &&
                  wards.map((w) => (
                    <Option key={w.ward_id} value={w.ward_id}>
                      {w.ward_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
              name='agreement'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            'Vui lòng đồng ý với điều khoản của chúng tôi'
                          )
                        ),
                },
              ]}
              {...tailFormItemLayout}>
              <Checkbox>
                Tôi đã đọc và chấp nhận <a href=''>các điều khoản dịch vụ </a>
              </Checkbox>
            </Form.Item> */}
            <Form.Item {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit'>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Register
