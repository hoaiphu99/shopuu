import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import {
  getSupplierDetails,
  updateSupplier,
} from '../../actions/supplierActions'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../../constants/formConstants'
import { SUPPLIER_UPDATE_RESET } from '../../constants/supplierConstants'
import { Form, Input, Select, Button, Checkbox, message } from 'antd'

const SupplierEdit = ({ match, history }) => {
  const supplierId = match.params.id

  const [name, setName] = useState('')
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

  const dispatch = useDispatch()

  const supplierDetails = useSelector((state) => state.supplierDetails)
  const { loading, error, supplier } = supplierDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const supplierUpdate = useSelector((state) => state.supplierUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
    supplier: userUpdated,
  } = supplierUpdate

  const key = 'update'

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const getProvinces = async () => {
        const { data } = await axios.get(
          'https://vapi.vnappmob.com/api/province'
        )
        setProvinces(data.results)
      }
      getProvinces()
      if (!supplier || supplier._id !== supplierId) {
        dispatch(getSupplierDetails(supplierId))
      } else if (success) {
        message.success({ content: 'Đã lưu!', key, duration: 2 })
        dispatch({ type: SUPPLIER_UPDATE_RESET })
      } else {
        setName(supplier.name)
        setPhone(supplier.phone)
        setAddress(supplier.supplierAddress.address)
        setCity(supplier.supplierAddress.city)
        setDistrict(supplier.supplierAddress.district)
        setWard(supplier.supplierAddress.ward)

        if (supplier.supplierAddress.city) {
          const city = provinces.find(
            (item) => item.province_name === supplier.supplierAddress.city
          )
          if (city) {
            getDistricts(city.province_id)
          }
        }
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, supplierId, supplier, success])

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
      supplier.supplierAddress.city

    const district =
      districts.find((item) => item.district_id === values.district) ||
      supplier.supplierAddress.district

    const ward =
      wards.find((item) => item.ward_id === values.ward) ||
      supplier.supplierAddress.ward

    const data = {
      _id: supplierId,
      name: values.name,
      phone: values.phone,
      supplierAddress: {
        address: values.address,
        city: city.province_name || supplier.supplierAddress.city,
        district: district.district_name || supplier.supplierAddress.district,
        ward: ward.ward_name || supplier.supplierAddress.ward,
      },
    }
    dispatch(updateSupplier(data))
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Nhà cung cấp' link3={supplierId} />
      <Button
        type='primary'
        onClick={() => history.push('/admin/suppliers')}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loadingUpdate &&
        message.loading({ content: 'Đang lưu...', key, duration: 10 })}
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
              name='name'
              initialValue={name}
              label='Tên nhà cung cấp'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên nhà cung cấp!',
                  whitespace: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='phone'
              initialValue={phone}
              label='Số điện thoại'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                  whitespace: true,
                },
              ]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='address'
              initialValue={address}
              label='Địa chỉ'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',
                  whitespace: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='city'
              initialValue={city}
              label='Tỉnh/Thành phố'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Tỉnh/Thành phố!',
                  whitespace: true,
                },
              ]}>
              <Select placeholder='Chọn Tỉnh/Thành phố'>
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
              label='Quận/Huyện'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Quận/Huyện!',
                  whitespace: true,
                },
              ]}>
              <Select placeholder='Chọn Quận/Huyện'>
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
              label='Xã/Phường'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Xã/Phường!',
                  whitespace: true,
                },
              ]}>
              <Select placeholder='Chọn Xã/Phường'>
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
                Lưu lại
              </Button>
            </Form.Item>
          </Form>
        )
      )}
    </>
  )
}

export default SupplierEdit
