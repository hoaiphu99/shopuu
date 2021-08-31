import React, { useState, useEffect } from 'react'
//import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Orders from './user/Orders'
import Order from './Order'
import CategoryList from './admin/CategoryList'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { formItemLayout, tailFormItemLayout } from '../constants/formConstants'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
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
  Breadcrumb,
  Descriptions,
} from 'antd'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

const Profile = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')

  const [isEdit, setIsEdit] = useState(false)

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [form] = Form.useForm()
  const { Option } = Select

  const [path, setPath] = useState('/')

  const { SubMenu } = Menu
  const { Content, Sider } = Layout

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
    user: userUpdate,
  } = userUpdateProfile

  const key = 'update'

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
      } else if (success) {
        dispatch(getUserDetails('profile'))
        userInfo.name = user.name
        message.success({ content: 'Saved!', key, duration: 2 })
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
      } else {
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setAddress(user.shippingAddress.address)
        setCity(user.shippingAddress.city)
        setDistrict(user.shippingAddress.district)
        setWard(user.shippingAddress.ward)
      }
    }
  }, [dispatch, history, userInfo, user, isEdit, success])

  // const submitHandler = (values) => {
  //   console.log(values)
  //   setIsEdit(!isEdit)
  //   // if (password !== confirmPassword) {
  //   // } else {
  //   //   dispatch(updateUserProfile({ id: user._id, name, email, password }))
  //   // }
  // }

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
      id: userInfo._id,
      email: values.email,
      name: values.name,
      phone: values.phone,
      shippingAddress: {
        address: values.address,
        city: city.province_name,
        district: district.district_name,
        ward: ward.ward_name,
      },
    }
    dispatch(updateUserProfile(data))
    setIsEdit(!isEdit)
  }

  return (
    <Container>
      <Layout>
        <Router>
          <Sider width={200} className='site-layout-background'>
            <Menu
              mode='inline'
              defaultSelectedKeys={['profile']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}>
              <SubMenu
                key='sub1'
                icon={<UserOutlined />}
                title={user && user.name}>
                <Menu.Item key='profile'>
                  <Link to='/profile'>Thông tin cá nhân</Link>
                </Menu.Item>
                <Menu.Item key='change-password'>
                  <Link to='/profile/change-password'>Đổi mật khẩu</Link>
                </Menu.Item>
                <Menu.Item key='orders'>
                  <Link to='/profile/orders'>Đơn hàng của tôi</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}

            <Content
              className='site-layout-background'
              style={{
                padding: 24,
                margin: '16px 0',
                minHeight: 280,
              }}>
              <Switch>
                <Route path='/order/:id' component={Order} />
                <Route exact path='/profile/orders' component={Orders}></Route>
                {loadingUpdate &&
                  message.loading({ content: 'Saving...', key, duration: 10 })}
                {errorUpdate &&
                  message.error({ content: `${error}`, key, duration: 2 })}
                {error && message.error({ content: `${error}`, duration: 2 })}
                {loading ? (
                  <Loader />
                ) : !isEdit ? (
                  <Descriptions
                    title='User Info'
                    extra={
                      <Button type='primary' onClick={() => setIsEdit(!isEdit)}>
                        Edit
                      </Button>
                    }>
                    <Descriptions.Item label='Name'>{name}</Descriptions.Item>
                    <Descriptions.Item label='Email'>{email}</Descriptions.Item>
                    <Descriptions.Item label='Phone'>{phone}</Descriptions.Item>
                    <Descriptions.Item label='Address'>
                      {`${address}, ${ward}, ${district}, ${city}`}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <>
                    <Form
                      onValuesChange={onValuesChange}
                      {...formItemLayout}
                      form={form}
                      name='register'
                      onFinish={submitHandler}
                      scrollToFirstError>
                      <Form.Item
                        name='email'
                        initialValue={email}
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
                        name='name'
                        initialValue={name}
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

                      <Form.Item
                        name='phone'
                        initialValue={phone}
                        label='Phone Number'>
                        <Input style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name='address'
                        initialValue={address}
                        label='Address'
                        tooltip='Your address for delivery orders'>
                        <Input />
                      </Form.Item>

                      <Form.Item name='city' initialValue={city} label='City'>
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
                        initialValue={district}
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

                      <Form.Item name='ward' initialValue={ward} label='Ward'>
                        <Select placeholder='select your ward'>
                          {wards &&
                            wards.map((w) => (
                              <Option key={w.ward_id} value={w.ward_id}>
                                {w.ward_name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item {...tailFormItemLayout}>
                        <Button type='primary' htmlType='submit'>
                          Save
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                )}
              </Switch>
            </Content>
          </Layout>
        </Router>
      </Layout>
    </Container>
  )
}

const test = () => {
  return <h1>Edit Profile</h1>
}

export default Profile
