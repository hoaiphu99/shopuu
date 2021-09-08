import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'
import Breadcrumb from '../../components/BreadcrumbComp'
import NumberFormat from 'react-number-format'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
  listOrderSuppliers,
  statusOrderSupplier,
} from '../../actions/orderSupplierActions'
import { ORDER_SUPPLIER_STATUS_RESET } from '../../constants/orderSupplierConstants'
import {
  message,
  Table,
  Tag,
  Space,
  Typography,
  Popconfirm,
  notification,
  Button,
} from 'antd'

const OrderSupplierList = ({ history }) => {
  const { Column } = Table
  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  const orderSupplierList = useSelector((state) => state.orderSupplierList)
  const { loading, error, orderSuppliers } = orderSupplierList

  const orderSupplierStatus = useSelector((state) => state.orderSupplierStatus)
  const { loading: loadingStatus, success: successStatus } = orderSupplierStatus

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (successStatus) {
        notification['error']({
          message: `Đã hủy phiếu đặt này`,
        })
        dispatch({ type: ORDER_SUPPLIER_STATUS_RESET })
        dispatch(listOrderSuppliers())
      }
      if (!orderSuppliers) dispatch(listOrderSuppliers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, orderSuppliers, successStatus])

  const orderStatusHandler = (id, status) => {
    dispatch(statusOrderSupplier(id, status))
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Phiếu đặt hàng' />
      <Button
        type='primary'
        onClick={() => {
          history.push('/admin/order-suppliers/create')
        }}
        style={{
          marginBottom: 16,
        }}>
        Lập phiếu đặt
      </Button>
      {error && message.error({ content: `${error}`, duration: 2 })}
      {loading ? (
        <Loader />
      ) : (
        <Table
          rowKey={(record) => record._id}
          dataSource={orderSuppliers}
          pagination={true}
          scroll={{ x: 1200, y: 400 }}>
          <Column
            title='ID'
            dataIndex='_id'
            key='_id'
            width='15%'
            render={(text) => (
              <Link to={`/admin/order-suppliers/${text}`}>{text}</Link>
            )}
          />
          <Column
            title='NHÂN VIÊN LẬP'
            dataIndex='user'
            key='user'
            render={(user) => {
              return user.name
            }}
          />
          <Column
            title='NGÀY LẬP'
            dataIndex='createdAt'
            key='createdAt'
            render={(text) => (
              <Moment format='DD/MM/YYYY hh:mm:ss'>{text}</Moment>
            )}
          />
          <Column
            title='TRẠNG THÁI'
            dataIndex='status'
            key='status'
            render={(status) => {
              let color =
                status === 'CANCEL'
                  ? 'red'
                  : status === 'WAIT'
                  ? 'orange'
                  : // : status === 'DELIVERY'
                    // ? 'cyan'
                    // : status === 'DELIVERED'
                    // ? 'geekblue'
                    // : status === 'FAIL'
                    // ? 'red'
                    'green'
              let msg =
                status === 'CANCEL'
                  ? 'Đã hủy'
                  : status === 'WAIT'
                  ? 'Chưa lập phiếu nhập'
                  : // : status === 'DELIVERY'
                    // ? 'Đang giao hàng'
                    // : status === 'DELIVERED'
                    // ? 'Giao hàng thành công'
                    // : status === 'FAIL'
                    // ? 'Giao hàng thất bại'
                    'Hoàn thành'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
          <Column
            title='TỔNG GIÁ'
            dataIndex='totalPrice'
            key='totalPrice'
            render={(text) => (
              <>
                <NumberFormat
                  value={text}
                  displayType={'text'}
                  thousandSeparator={true}
                />{' '}
                <sup>đ</sup>
              </>
            )}
          />
          <Column
            title='NHÀ CUNG CẤP'
            dataIndex='supplier'
            key='supplier'
            render={(supplier) => {
              return supplier.name
            }}
          />

          <Column
            fixed='right'
            width='15%'
            title='HÀNH ĐỘNG'
            dataIndex='action'
            key='action'
            render={(_, record) => {
              return (
                <Space size='middle'>
                  {/* {record.status === 'WAIT' && (
                    <Typography.Link
                      onClick={() => {
                        orderStatusHandler(record._id, 'ACCEPT')
                        setStatus('success')
                      }}>
                      Xác nhận
                    </Typography.Link>
                  )} */}

                  <Typography.Link
                    onClick={() => {
                      history.push(`/admin/order-suppliers/${record._id}`)
                    }}>
                    Chi tiết
                  </Typography.Link>
                  {record.status !== 'CANCEL' && record.status !== 'FINISH' && (
                    <Popconfirm
                      title='Chắc chắn hủy?'
                      onConfirm={() => {
                        orderStatusHandler(record._id, 'CANCEL')
                      }}>
                      <a>Hủy</a>
                    </Popconfirm>
                  )}
                </Space>
              )
            }}></Column>
        </Table>
      )}
    </>
  )
}

export default OrderSupplierList
