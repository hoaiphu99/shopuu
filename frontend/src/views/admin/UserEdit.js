import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import { getUserDetails, updateUser } from '../../actions/userActions'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../../constants/formConstants'
import { USER_UPDATE_RESET } from '../../constants/userConstants'
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  message,
  Layout,
  Menu,
} from 'antd'

const UserEdit = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [form] = Form.useForm()
  const { Option } = Select

  // const { SubMenu } = Menu
  // const { Content, Sider } = Layout

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
    user: userUpdated,
  } = userUpdate

  const key = 'update'

  useEffect(() => {
    const getProvinces = async () => {
      const { data } = await axios.get('https://vapi.vnappmob.com/api/province')
      setProvinces(data.results)
    }
    getProvinces()
    if (!user || !user.name || user._id !== userId) {
      dispatch(getUserDetails(userId))
    } else if (success) {
      message.success({ content: '???? l??u!', key, duration: 2 })
      dispatch({ type: USER_UPDATE_RESET })
    } else {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
      setPhone(user.phone)
      setAddress(user.shippingAddress.address)
      setCity(user.shippingAddress.city)
      setDistrict(user.shippingAddress.district)
      setWard(user.shippingAddress.ward)

      if (user.shippingAddress.city) {
        const city = provinces.find(
          (item) => item.province_name === user.shippingAddress.city
        )
        if (city) {
          getDistricts(city.province_id)
        }
      }
    }
  }, [dispatch, history, userId, user, success])

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
      provinces.find((item) => item.province_id === values.city) ||
      user.shippingAddress.city

    const district =
      districts.find((item) => item.district_id === values.district) ||
      user.shippingAddress.district

    const ward =
      wards.find((item) => item.ward_id === values.ward) ||
      user.shippingAddress.ward

    const data = {
      _id: userId,
      email: values.email,
      name: values.name,
      isAdmin: values.isAdmin,
      phone: values.phone,
      shippingAddress: {
        address: values.address,
        city: city.province_name || user.shippingAddress.city,
        district: district.district_name || user.shippingAddress.district,
        ward: ward.ward_name || user.shippingAddress.ward,
      },
    }
    dispatch(updateUser(data))
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Ng?????i d??ng' link3={userId} />
      <Button
        type='primary'
        onClick={() => history.push('/admin/users')}
        style={{
          marginBottom: 16,
        }}>
        Tr??? v???
      </Button>
      {loadingUpdate &&
        message.loading({ content: '??ang l??u...', key, duration: 10 })}
      {errorUpdate &&
        message.error({ content: `${errorUpdate}`, key, duration: 2 })}
      {loading ? (
        <Loader />
      ) : error ? (
        message.error({ content: `${error}`, duration: 2 })
      ) : (
        name && (
          <Form
            onValuesChange={onValuesChange}
            {...formItemLayoutDetails}
            form={form}
            name='edit'
            onFinish={submitHandler}
            scrollToFirstError>
            <Form.Item
              name='email'
              initialValue={email}
              label='E-mail'
              rules={[
                {
                  type: 'email',
                  message: 'Email kh??ng h???p l???!',
                },
                {
                  required: true,
                  message: 'Vui l??ng nh???p E-mail!',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='name'
              initialValue={name}
              label='H??? t??n'
              tooltip='Ch??ng t??i c?? th??? g???i b???n l?? g???'
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p t??n!',
                  whitespace: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item name='phone' initialValue={phone} label='S??? ??i???n tho???i'>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='address'
              initialValue={address}
              label='?????a ch???'
              tooltip='?????a ch??? ????? ch??ng t??i giao h??ng cho b???n'>
              <Input />
            </Form.Item>

            <Form.Item name='city' initialValue={city} label='T???nh/Th??nh ph???'>
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

            <Form.Item name='ward' initialValue={ward} label='X??/Ph?????ng'>
              <Select placeholder='Ch???n X??/Ph?????ng'>
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
              initialValue={isAdmin}
              valuePropName='checked'
              wrapperCol={{ offset: 4, span: 16 }}>
              <Checkbox>Admin</Checkbox>
            </Form.Item>

            <Form.Item {...tailFormItemLayoutDetails}>
              <Button type='primary' htmlType='submit'>
                L??u l???i
              </Button>
            </Form.Item>
          </Form>
        )
      )}
    </>
  )
}

export default UserEdit
