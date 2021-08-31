import React, { useState, useEffect } from 'react'
//import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import { listUsers, updateUser, register } from '../../actions/userActions'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../../constants/formConstants'
import { USER_REGISTER_RESET } from '../../constants/userConstants'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  message,
  Typography,
  Layout,
  Divider,
  Menu,
  Descriptions,
} from 'antd'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

const UserCreate = ({ history }) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [form] = Form.useForm()
  const { Option } = Select

  const { SubMenu } = Menu
  const { Content, Sider } = Layout

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, success } = userRegister

  const key = 'create'

  useEffect(() => {
    const getProvinces = async () => {
      const { data } = await axios.get('https://vapi.vnappmob.com/api/province')
      setProvinces(data.results)
    }
    getProvinces()
    if (success) {
      message.success({ content: 'Thêm thành công!', key, duration: 2 })
      dispatch(listUsers())
      dispatch({ type: USER_REGISTER_RESET })
      history.push('/admin/users')
    }
  }, [dispatch, history, success])

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
    console.log(changedValues)
    if (changedValues.city) getDistricts(changedValues.city)
    if (changedValues.district) getWards(changedValues.district)
  }

  const submitHandler = (values) => {
    console.log(values)
    const city =
      provinces.find((item) => item.province_id === values.city) || ' '

    const district =
      districts.find((item) => item.district_id === values.district) || ' '

    const ward = wards.find((item) => item.ward_id === values.ward) || ' '

    const data = {
      email: values.email,
      name: values.name,
      password: values.password,
      isAdmin: values.isAdmin,
      phone: values.phone,
      shippingAddress: {
        address: values.address,
        city: city.province_name,
        district: district.district_name,
        ward: ward.ward_name,
      },
    }
    dispatch(register(data))
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Người dùng' link3='Thêm mới' />
      <Button
        type='primary'
        onClick={() => history.push('/admin/users')}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loading &&
        message.loading({ content: 'Đang tạo...', key, duration: 10 })}
      {error && message.error({ content: `${error}`, key, duration: 2 })}
      <Form
        onValuesChange={onValuesChange}
        {...formItemLayoutDetails}
        form={form}
        name='create'
        onFinish={submitHandler}
        scrollToFirstError>
        <Form.Item
          name='email'
          label='E-mail'
          rules={[
            {
              type: 'email',
              message: 'Email không hợp lệ!',
            },
            {
              required: true,
              message: 'Vui lòng nhập E-mail!',
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
                  new Error('The two passwords that you entered do not match!')
                )
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='name'
          label='Họ tên'
          tooltip='Chúng tôi có thể gọi bạn là gì?'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên!',
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

        <Form.Item
          name='isAdmin'
          valuePropName='checked'
          wrapperCol={{ offset: 4, span: 16 }}>
          <Checkbox>Admin</Checkbox>
        </Form.Item>

        <Form.Item {...tailFormItemLayoutDetails}>
          <Button type='primary' htmlType='submit'>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default UserCreate
