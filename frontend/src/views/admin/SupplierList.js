import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message, Table, Space, Typography, Popconfirm, Button } from 'antd'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import { listSuppliers, deleteSupplies } from '../../actions/supplierActions'
import { SUPPLIER_DELETE_RESET } from '../../constants/supplierConstants'

const SupplierList = ({ history }) => {
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const supplierList = useSelector((state) => state.supplierList)
  const { loading, error, suppliers } = supplierList

  const supplierDelete = useSelector((state) => state.supplierDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = supplierDelete

  const key = 'msg'

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!suppliers) {
        dispatch(listSuppliers())
      } else if (successDelete) {
        message.success({ content: 'Đã xóa!', key, duration: 2 })
        dispatch({ type: SUPPLIER_DELETE_RESET })
        dispatch(listSuppliers())
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, suppliers, successDelete])

  // const handleUpdate = (record) => {}

  // const handleCreate = (values) => {
  //   setIsAdd(!isAdd)
  // }

  const handleDelete = (id) => {
    dispatch(deleteSupplies(id))
  }

  const columns = [
    {
      title: 'ID',
      width: 80,
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tên nhà cung cấp',
      width: 80,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 50,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'supplierAddress',
      key: 'supplierAddress',
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record && record.supplierAddress.address},{' '}
            {record && record.supplierAddress.ward},{' '}
            {record && record.supplierAddress.district},{' '}
            {record && record.supplierAddress.city}
          </>
        )
      },
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
              onConfirm={() => handleDelete(record._id)}>
              <a>Xóa</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const edit = (record) => {
    history.push(`suppliers/${record._id}`)
  }

  return (
    <>
      <div>
        <Breadcrumb link1='Admin' link2='Nhà cung cấp' />
        <Button
          type='primary'
          onClick={() => {
            history.push('/admin/suppliers/create')
          }}
          style={{
            marginBottom: 16,
          }}>
          {isEdit ? 'Trở về' : !isAdd ? 'Thêm mới' : 'Hủy'}
        </Button>
        {loadingDelete &&
          message.loading({ content: 'Đang xóa...', key, duration: 10 })}
        {errorDelete &&
          message.error({ content: `${errorDelete}`, key, duration: 2 })}
        {error && message.error({ content: `${error}`, duration: 2 })}
        {loading ? (
          <Loader />
        ) : (
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={suppliers}
            pagination={true}
            scroll={{ x: 1200, y: 400 }}></Table>
        )}
      </div>
    </>
  )
}

export default SupplierList
