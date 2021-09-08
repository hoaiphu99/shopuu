import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
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
import {
  MinusCircleOutlined,
  PlusOutlined,
  PercentageOutlined,
} from '@ant-design/icons'
import { listAllProducts, updateDiscount } from '../../actions/productActions'
import { PRODUCT_UPDATE_DISCOUNT_RESET } from '../../constants/productConstants'

const DiscountCreate = ({ history }) => {
  const [form] = Form.useForm()

  const { Option } = Select

  const [productSelect, setProductSelect] = useState()
  const [prevSelectItem, setPrevSelectItem] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productAll = useSelector((state) => state.productAll)
  const { loading: loadingProduct, error: errorProduct, products } = productAll

  const productUpdateDiscount = useSelector(
    (state) => state.productUpdateDiscount
  )
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = productUpdateDiscount

  const key = 'create'

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!products) {
        dispatch(listAllProducts())
      } else {
        if (successUpdate) {
          message.success({
            content: 'Cập nhật giảm giá thành công!',
            key,
            duration: 2,
          })
          dispatch({ type: PRODUCT_UPDATE_DISCOUNT_RESET })
        }

        if (!productSelect) {
          setProductSelect(products)
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
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, products, prevSelectItem, successUpdate])

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Chưa chọn sản phẩm',
      description: 'Hãy chọn ít nhất 1 sản phẩm trước khi cập nhật giảm giá!',
    })
  }

  const onFinish = (values) => {
    if (!values.discountProducts || values.discountProducts.length <= 0) {
      openNotificationWithIcon('warning')
      return
    }
    dispatch(updateDiscount(values))
    console.log('Received values of form:', values)
  }

  const handleChange = () => {
    form.setFieldsValue({ sights: [] })
  }

  const handleChangeSelectProduct = (value) => {
    if (value !== prevSelectItem) setPrevSelectItem(value)
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Cập nhật giảm giá' />
      <Button
        type='primary'
        onClick={() => history.goBack()}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loadingUpdate &&
        message.loading({ content: 'Đang tạo...', key, duration: 10 })}
      {errorUpdate &&
        message.error({ content: `${errorUpdate}`, key, duration: 2 })}

      <Form
        form={form}
        name='dynamic_form_nest_item'
        onFinish={onFinish}
        autoComplete='off'>
        <Form.Item
          name='discount'
          label='Giảm giá (%)'
          rules={[{ required: true, message: 'Chưa nhập % giảm giá!' }]}>
          <InputNumber
            addonAfter={<PercentageOutlined />}
            defaultValue={0}
            min={0}
          />
        </Form.Item>
        <Form.List name='discountProducts'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <>
                  <Space key={field.key} align='baseline'>
                    <Form.Item
                      noStyle
                      rules={[
                        { required: true, message: 'Chưa chọn sản phẩm!' },
                      ]}
                      shouldUpdate={(prevValues, curValues) => {
                        setSelectedItems(curValues.discountProducts)
                        return (
                          prevValues.productSelect !== curValues.productSelect
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

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Cập nhật giảm giá
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default DiscountCreate
