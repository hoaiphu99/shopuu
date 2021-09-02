import React, { useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import {
  message,
  Table,
  Space,
  Typography,
  Popconfirm,
  Button,
} from 'antd'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import { listAllProducts, deleteProduct } from '../../actions/productActions'
import { PRODUCT_DELETE_RESET } from '../../constants/productConstants'

const ProductList = ({ match, history }) => {
  const dispatch = useDispatch()
  console.log(history)
  const productAll = useSelector((state) => state.productAll)
  const { loading, error, products } = productAll

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const key = 'msg'
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listAllProducts())
      // if (!products || products.length <= 0) {
      //   //dispatch(listAllProducts())
      // } else
      if (successDelete) {
        message.success({ content: 'Đã xóa!', key, duration: 2 })
        dispatch({ type: PRODUCT_DELETE_RESET })
        dispatch(listAllProducts())
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete])

  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tên sản phẩm',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      width: 50,
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        return (
          <NumberFormat
            value={record.price}
            displayType={'text'}
            thousandSeparator={true}>
            {' '}
            VNĐ{' '}
          </NumberFormat>
        )
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (_, record) => {
        return <>{record.category.name}</>
      },
      width: 100,
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
      width: 80,
      render: (_, record) => {
        return <>{record.brand.name}</>
      },
    },
    {
      title: 'SL tồn',
      dataIndex: 'countInStock',
      key: 'countInStock',
      width: 30,
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 60,
      render: (_, record) => {
        return (
          <Space size='middle'>
            <Typography.Link onClick={() => edit(record)}>
              Chi tiết
            </Typography.Link>
            <Popconfirm
              title='Chắc chắn xóa?'
              onConfirm={() => deleteHandler(record._id)}>
              <a>Xóa</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const edit = (record) => {
    //console.log(record)
    history.push(`products/${record._id}`)
  }

  const deleteHandler = (id) => {
    dispatch(deleteProduct(id))
  }
  return (
    <>
      <div>
        <Breadcrumb link1='Admin' link2='Sản phẩm' />
        <Button
          type='primary'
          onClick={() => {
            history.push('/admin/products/create')
          }}
          style={{
            marginBottom: 16,
          }}>
          Thêm mới
        </Button>
        {loadingDelete &&
          message.loading({ content: 'Đang xóa...', key, duration: 10 })}
        {errorDelete &&
          message.error({ content: `${errorDelete}`, key, duration: 2 })}
        {error && message.error({ content: `${error}`, duration: 2 })}
        {loading ? (
          <Loader />
        ) : error ? (
          message.error()
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : (
              <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={products}
                pagination={true}
                scroll={{ x: 1200, y: 400 }}></Table>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ProductList
