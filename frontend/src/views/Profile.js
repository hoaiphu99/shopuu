import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Orders from './user/Orders'
import ChangePassword from './user/ChangePassword'
import Order from './Order'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { formItemLayout, tailFormItemLayout } from '../constants/formConstants'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Layout,
  Menu,
  Descriptions,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'

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

  //const [path, setPath] = useState('/')

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
        message.success({ content: '???? c???p nh???t!', key, duration: 2 })
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
        city: (city && city.province_name) || values.city,
        district: (district && district.district_name) || values.district,
        ward: (ward && ward.ward_name) || values.ward,
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
                  <Link to='/profile'>Th??ng tin c?? nh??n</Link>
                </Menu.Item>
                <Menu.Item key='change-password'>
                  <Link to='/profile/change-password'>?????i m???t kh???u</Link>
                </Menu.Item>
                <Menu.Item key='orders'>
                  <Link to='/profile/orders'>????n h??ng c???a t??i</Link>
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
                <Route exact path='/profile/change-password' component={ChangePassword}></Route>
                <Route exact path='/profile/orders' component={Orders}></Route>
                {loadingUpdate &&
                  message.loading({
                    content: '??ang l??u l???i...',
                    key,
                    duration: 10,
                  })}
                {errorUpdate &&
                  message.error({ content: `${error}`, key, duration: 2 })}
                {error && message.error({ content: `${error}`, duration: 2 })}
                {loading ? (
                  <Loader />
                ) : !isEdit ? (
                  <Descriptions
                    title='Th??ng tin c?? nh??n'
                    extra={
                      <Button type='primary' onClick={() => setIsEdit(!isEdit)}>
                        Ch???nh s???a
                      </Button>
                    }>
                    <Descriptions.Item label='H??? & T??n'>
                      {name}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>{email}</Descriptions.Item>
                    <Descriptions.Item label='S??? ??i???n tho???i'>
                      {phone}
                    </Descriptions.Item>
                    <Descriptions.Item label='?????a ch???'>
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
                        label='Email'
                        rules={[
                          {
                            type: 'email',
                            message: 'E-mail kh??ng h???p l???!',
                          },
                          {
                            required: true,
                            message: 'Please input your E-mail!',
                          },
                        ]}>
                        <Input disabled />
                      </Form.Item>

                      <Form.Item
                        name='name'
                        initialValue={name}
                        label='H??? & T??n'
                        tooltip='Ch??ng t??i c?? th??? g???i b???n l???'
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p h??? t??n!',
                            whitespace: true,
                          },
                        ]}>
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name='phone'
                        initialValue={phone}
                        label='S??? ??i???n tho???i'>
                        <Input style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name='address'
                        initialValue={address}
                        label='?????a ch???'
                        tooltip='?????a ch??? ????? ch??ng t??i c?? th??? giao h??ng cho b???n'>
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name='city'
                        initialValue={city}
                        label='T???nh/Th??nh ph???'>
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
                        initialValue={district}
                        label='Qu???n/Huy???n'>
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
                        initialValue={ward}
                        label='X??/Ph?????ng'>
                        <Select placeholder='Ch???n X??/Ph?????ng'>
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
                          L??u l???i
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
