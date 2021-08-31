import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumb from '../../components/BreadcrumbComp'
import Loader from '../../components/Loader'
import { createProduct } from '../../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../../constants/formConstants'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Upload,
} from 'antd'
import {
  UploadOutlined,
} from '@ant-design/icons'
import { listCategories } from '../../actions/categoryActions'
import { listBrands } from '../../actions/brandActions'

const ProductCreate = ({ history }) => {
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [cateSelect, setCateSelect] = useState([])
  const [brandSelect, setBrandSelect] = useState([])

  const [form] = Form.useForm()

  const dispatch = useDispatch()

  const productCreate = useSelector((state) => state.productCreate)
  const { loading, error, success } = productCreate

  const categoryList = useSelector((state) => state.categoryList)
  const { loading: loadingCate, categories } = categoryList

  const brandList = useSelector((state) => state.brandList)
  const { loading: loadingBrand, brands } = brandList

  const key = 'create'

  useEffect(() => {
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
    if (success) {
      message.success({ content: 'Đã thêm!', key, duration: 2 })
      dispatch({ type: PRODUCT_CREATE_RESET })
      history.push('/admin/products')
    }
  }, [dispatch, history, success, loadingBrand])

  const submitHandler = (values) => {
    const data = {
      name: values.name,
      price: values.price,
      image: image,
      brand: values.brand,
      category: values.category,
      countInStock: values.countInStock,
      description: values.description ? values.description : ' ',
    }
    console.log(data)
    dispatch(createProduct(data))
  }

  const uploadFileHandler = async (file) => {
    console.log(file)
    //const uploadFile = file.file
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
      <Breadcrumb link1='Admin' link2='Sản phẩm' link3='Thêm mới' />
      <Button
        type='primary'
        onClick={() => history.push('/admin/products')}
        style={{
          marginBottom: 16,
        }}>
        Trở về
      </Button>
      {loading &&
        message.loading({ content: 'Đang thêm...', key, duration: 10 })}
      {error && message.error({ content: `${error}`, key, duration: 2 })}
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
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên sản phẩm',
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item name='description' label='Mô tả'>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name='price'
          label='Giá'
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
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn thương hiệu',
            },
          ]}>
          <Select placeholder='Chọn thương hiệu'>
            {!loadingBrand &&
              brandSelect.map((b) => (
                <Select.Option key={b._id} value={b._id}>
                  {b.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='category'
          label='Danh mục'
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
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ảnh',
            },
          ]}
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
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ProductCreate
