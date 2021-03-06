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
  message,
  Upload,
  Modal,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const ProductEdit = ({ match, history }) => {
  const productId = match.params.id
  const [images, setImages] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [cateSelect, setCateSelect] = useState([])
  const [brandSelect, setBrandSelect] = useState([])

  const [form] = Form.useForm()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)

  const [brand, setBrand] = useState({})
  const [category, setCategory] = useState({})
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [discount, setDiscount] = useState(0)
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
      message.success({ content: '???? l??u!', key, duration: 2 })
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
        const fileList = product.images.map((image, index) => {
          return {
            uid: index,
            name: image.imageName,
            status: 'done',
            url: image.imageLink,
          }
        })
        setName(product.name)
        setPrice(product.price)
        setDiscount(product.discount)
        setImages(product.images)
        setFileList(fileList)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate, loadingBrand])

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
    setPreviewVisible(true)
  }

  const handleChange = ({ fileList }) => {
    setFileList(fileList)
  }

  const customRequest = async ({
    file,
    headers,
    onSuccess,
    onProgress,
    onError,
  }) => {
    const formData = new FormData()
    formData.set('image', file, `${file.name}`)
    setUploading(true)
    onProgress({ percent: 50 })
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      const newImage = {
        imageName: data.fileName,
        imageLink: data.fileLocation,
      }
      setImages((prevImages) => [...prevImages, newImage])
      setUploading(false)
      onSuccess('ok')
    } catch (error) {
      console.log(error)
      setUploading(false)
      onError(error)
    }
  }

  const submitHandler = (values) => {
    console.log(values)
    const data = {
      _id: productId,
      name: values.name,
      price: values.price,
      discount: values.discount,
      images: images,
      brand: values.brand === brand.name ? brand._id : values.brand,
      category:
        values.category === category.name ? category._id : values.category,
      countInStock: values.countInStock,
      description: values.description ? values.description : ' ',
    }

    dispatch(updateProduct(data))
  }

  const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    if (e.file && e.fileList && e.file.status === 'removed') {
      const changeImage = images.filter(
        (image) => image.imageName !== e.file.name
      )
      setImages(changeImage)
      console.log('==change', changeImage)
    }

    return e && e.fileList
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='S???n ph???m' link3='Ch???nh s???a' />
      <Button
        type='primary'
        onClick={() => history.push('/admin/products')}
        style={{
          marginBottom: 16,
        }}>
        Tr??? v???
      </Button>
      {loadingUpdate &&
        message.loading({ content: '??ang l??u...', key, duration: 10 })}
      {errorUpdate && message.error({ content: `${error}`, key, duration: 2 })}
      {loading ? (
        <Loader />
      ) : error ? (
        message.error({ content: `${error}`, duration: 2 })
      ) : (
        name && (
          <Form
            onValuesChange={(values) => console.log(values)}
            {...formItemLayoutDetails}
            form={form}
            name='create'
            onFinish={submitHandler}
            scrollToFirstError>
            <Form.Item
              name='name'
              label='T??n s???n ph???m'
              initialValue={name}
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p t??n s???n ph???m',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='description'
              label='M?? t???'
              initialValue={description}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name='price'
              label='Gi?? (VN??)'
              initialValue={price}
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p gi??!',
                },
              ]}>
              <InputNumber min='0' />
            </Form.Item>

            <Form.Item
              name='discount'
              label='Gi???m gi?? (%)'
              initialValue={discount}>
              <InputNumber min='0' />
            </Form.Item>

            {/* <Form.Item
              name='countInStock'
              label='S??? l?????ng t???n'
              initialValue={countInStock}
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p s??? l?????ng t???n',
                },
              ]}>
              <InputNumber min='0' />
            </Form.Item> */}

            <Form.Item
              name='brand'
              label='Th????ng hi???u'
              initialValue={brand.name}
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng ch???n th????ng hi???u',
                },
              ]}>
              <Select placeholder='Ch???n th????ng hi???u'>
                {brandSelect.map((b) => (
                  <Select.Option key={b._id} value={b._id}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='category'
              label='Lo???i s???n ph???m'
              initialValue={category.name}
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng ch???n lo???i s???n ph???m',
                },
              ]}>
              <Select placeholder='Ch???n lo???i s???n ph???m'>
                {cateSelect.map((c) => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='upload'
              label='H??nh ???nh'
              initialValue={fileList}
              valuePropName='fileList'
              getValueFromEvent={normFile}>
              <Upload
                name='logo'
                customRequest={customRequest}
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}>
                {fileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>T???i ???nh l??n</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item {...tailFormItemLayoutDetails}>
              <Button type='primary' htmlType='submit'>
                L??u l???i
              </Button>
            </Form.Item>
          </Form>
        )
      )}

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default ProductEdit
