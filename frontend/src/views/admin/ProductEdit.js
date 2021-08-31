import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import { detailsProduct, updateProduct } from '../../actions/productActions'
import { listCategories } from '../../actions/categoryActions'
import { listBrands } from '../../actions/brandActions'
import { PRODUCT_UPDATE_RESET } from '../../constants/productConstants'
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
  InputNumber,
  Checkbox,
  message,
  Typography,
  Layout,
  Divider,
  Menu,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const ProductEdit = ({ match, history }) => {
  const productId = match.params.id

  const [cateSelect, setCateSelect] = useState([])
  const [brandSelect, setBrandSelect] = useState([])

  const [form] = Form.useForm()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState({})
  const [category, setCategory] = useState({})
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const categoryList = useSelector((state) => state.categoryList)
  const { loading: loadingCate, categories } = categoryList

  const brandList = useSelector((state) => state.brandList)
  const { loading: loadingBrand, brands } = brandList

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const key = 'msg'

  useEffect(() => {
    if (successUpdate) {
      message.success({ content: 'Đã lưu!', key, duration: 2 })
      dispatch({ type: PRODUCT_UPDATE_RESET })
    } else {
      if (!product || !product.name || product._id !== productId) {
        dispatch(detailsProduct(productId, 'id'))
        if (
          !categories ||
          !brands ||
          categories.length === 0 ||
          brands.length === 0
        ) {
          dispatch(listCategories())
          dispatch(listBrands())
        } else {
          setCateSelect(categories)
          setBrandSelect(brands)
        }
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate, loadingBrand])

  const submitHandler = (values) => {
    const data = {
      _id: productId,
      name: values.name,
      price: values.price,
      image: image,
      brand: values.brand === brand.name ? brand._id : values.brand,
      category:
        values.category === category.name ? category._id : values.category,
      countInStock: values.countInStock,
      description: values.description ? values.description : ' ',
    }

    dispatch(updateProduct(data))
  }

  const uploadFileHandler = async (file) => {
    const formData = new FormData()
    formData.set('image', file, `${file.lastModified}-${file.name}`)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data.fileLocation)
      setUploading(false)
      console.log(data)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    if (!e.file.status || e.file.status !== 'removed') {
      uploadFileHandler(e.file)
    }
    return e && e.fileList
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Sản phẩm' link3='Chỉnh sửa' />
      <Button
        type='primary'
        onClick={() => history.push('/admin/products')}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loadingUpdate &&
        message.loading({ content: 'Đang lưu...', key, duration: 10 })}
      {errorUpdate && message.error({ content: `${error}`, key, duration: 2 })}
      {loading ? (
        <Loader />
      ) : error ? (
        message.error({ content: `${error}`, duration: 2 })
      ) : (
        name && (
          <Form
            // onValuesChange={onValuesChange}
            {...formItemLayoutDetails}
            form={form}
            name='create'
            onFinish={submitHandler}
            scrollToFirstError>
            <Form.Item
              name='name'
              label='Tên sản phẩm'
              initialValue={name}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên sản phẩm',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='description'
              label='Mô tả'
              initialValue={description}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name='price'
              label='Giá'
              initialValue={price}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá!',
                },
              ]}>
              <InputNumber />
            </Form.Item>

            <Form.Item
              name='countInStock'
              label='Số lượng tồn'
              initialValue={countInStock}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng tồn',
                },
              ]}>
              <InputNumber />
            </Form.Item>

            <Form.Item
              name='brand'
              label='Thương hiệu'
              initialValue={brand.name}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn thương hiệu',
                },
              ]}>
              <Select placeholder='Chọn thương hiệu'>
                {brandSelect.map((b) => (
                  <Select.Option key={b._id} value={b._id}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='category'
              label='Danh mục'
              initialValue={category.name}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn danh mục',
                },
              ]}>
              <Select placeholder='Chọn danh mục'>
                {cateSelect.map((c) => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='upload'
              label='Hình ảnh'
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn ảnh',
              //   },
              // ]}
              valuePropName='fileList'
              getValueFromEvent={normFile}>
              <Upload
                name='logo'
                beforeUpload={() => false}
                // action={uploadFileHandler}
                listType='picture'>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                {uploading && <Loader />}
              </Upload>
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

export default ProductEdit
