import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import NumberFormat from 'react-number-format'
import Breadcrumb from '../../components/BreadcrumbComp'
import {
  Form,
  InputNumber,
  Button,
  Space,
  Select,
  Typography,
  message,
  notification,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { listAllProducts } from '../../actions/productActions'
import { listSuppliers } from '../../actions/supplierActions'
import { createOrderSupplier } from '../../actions/orderSupplierActions'
import { ORDER_SUPPLIER_CREATE_RESET } from '../../constants/orderSupplierConstants'

const OrderSupplierCreate = ({ history }) => {
  const [form] = Form.useForm()

  const { Option } = Select

  const [productSelect, setProductSelect] = useState()
  const [supplierSelect, setSupplierSelect] = useState()
  const [prevSelectItem, setPrevSelectItem] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderSupplierCreate = useSelector((state) => state.orderSupplierCreate)
  const {
    loading: loadingCreate,
    success,
    error: errorCreate,
  } = orderSupplierCreate

  const productAll = useSelector((state) => state.productAll)
  const { loading: loadingProduct, error: errorProduct, products } = productAll

  const supplierList = useSelector((state) => state.supplierList)
  const { loading, error, suppliers } = supplierList

  const key = 'create'

  useEffect(() => {
    if (success) {
      message.success({
        content: 'Lập phiếu đặt thành công!',
        key,
        duration: 2,
      })
      dispatch({ type: ORDER_SUPPLIER_CREATE_RESET })
      history.push('/admin/order-suppliers')
    }
    if (userInfo && userInfo.isAdmin) {
      if (!products || !suppliers) {
        dispatch(listSuppliers())
        dispatch(listAllProducts())
      } else {
        if (!productSelect || !supplierSelect) {
          setProductSelect(products)
          setSupplierSelect(suppliers)
        }
      }
    } else {
      history.push('/login')
    }
    if (productSelect && products) {
      setProductSelect(() =>
        products.filter((item) => {
          const product = selectedItems.find((i) => {
            if (i) {
              return i.product === item._id
            }
            return null
          })
          if (product) {
            return item._id !== product.product
          }
          return item
        })
      )
    }
  }, [dispatch, history, products, prevSelectItem, supplierSelect, success])

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Chưa chọn sản phẩm',
      description: 'Hãy chọn ít nhất 1 sản phẩm trước khi lập phiếu đặt!',
    })
  }

  const onFinish = (values) => {
    if (!values.orderItems || values.orderItems.length <= 0) {
      openNotificationWithIcon('warning')
      return
    }
    const data = {
      ...values,
      totalPrice: values.orderItems.reduce((acc, cur) => {
        return acc + cur.price * cur.qty
      }, 0),
    }
    dispatch(createOrderSupplier(data))
    console.log('Received values of form:', data)
  }

  const handleChange = () => {
    form.setFieldsValue({ sights: [] })
  }

  const handleChangeSelectProduct = (value) => {
    if (value !== prevSelectItem) setPrevSelectItem(value)
  }

  return (
    <>
      <Breadcrumb
        link1='Admin'
        link2='Phiếu đặt hàng'
        link3='Lập phiếu đặt hàng'
      />
      <Button
        type='primary'
        onClick={() => history.push('/admin/order-suppliers')}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loadingCreate &&
        message.loading({ content: 'Đang tạo...', key, duration: 10 })}
      {errorCreate &&
        message.error({ content: `${errorCreate}`, key, duration: 2 })}

      <Form
        form={form}
        name='dynamic_form_nest_item'
        onFinish={onFinish}
        autoComplete='off'>
        <Form.Item
          name='supplier'
          label='Nhà cung cấp'
          rules={[{ required: true, message: 'Chưa chọn nhà cung cấp!' }]}>
          <Select onChange={handleChange} placeholder='Chọn nhà cung cấp'>
            {supplierSelect &&
              supplierSelect.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.List name='orderItems'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <>
                  <Space key={field.key} align='baseline'>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        setSelectedItems(curValues.orderItems)
                        return (
                          prevValues.productSelect !==
                            curValues.productSelect ||
                          prevValues.supplierSelect !== curValues.supplierSelect
                        )
                      }}>
                      {() => (
                        <Form.Item
                          {...field}
                          label='Sản phẩm'
                          name={[field.name, 'product']}
                          fieldKey={[field.fieldKey, 'product']}
                          rules={[
                            { required: true, message: 'Chưa chọn sản phẩm' },
                          ]}>
                          <Select
                            disabled={!form.getFieldValue('supplier')}
                            style={{ width: 520 }}
                            onChange={handleChangeSelectProduct}>
                            {productSelect &&
                              productSelect.map((item) => (
                                <Option key={item._id} value={item._id}>
                                  {/* <img
                                  src={item.images[0].imageLink}
                                  width='20%'
                                /> */}
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      )}
                    </Form.Item>

                    <Form.Item
                      // labelCol={{ span: 4 }}
                      // wrapperCol={{ span: 16 }}
                      {...field}
                      label='Giá nhập (VNĐ)'
                      name={[field.name, 'price']}
                      fieldKey={[field.fieldKey, 'price']}
                      rules={[{ required: true, message: 'Chưa nhập giá !' }]}>
                      <InputNumber min={1} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      // labelCol={{ span: 4 }}
                      // wrapperCol={{ span: 16 }}
                      {...field}
                      label='Số lượng nhập'
                      name={[field.name, 'qty']}
                      fieldKey={[field.fieldKey, 'qty']}
                      rules={[
                        { required: true, message: 'Chưa nhập số lượng!' },
                      ]}>
                      <InputNumber min={1} style={{ width: 150 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                </>
              ))}

              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => {
                    add()
                  }}
                  block
                  icon={<PlusOutlined />}>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Typography.Title level={5}>
          Tổng giá:{' '}
          {selectedItems.reduce((acc, cur) => {
            if (cur && cur.qty)
              return (
                <>
                  <NumberFormat
                    value={acc + cur.price * cur.qty}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <sup>đ</sup>
                </>
              )
            return (
              <>
                <NumberFormat
                  value={acc}
                  displayType={'text'}
                  thousandSeparator={true}
                />
                <sup>đ</sup>
              </>
            )
          }, 0)}
        </Typography.Title>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Lập phiếu đặt
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default OrderSupplierCreate
