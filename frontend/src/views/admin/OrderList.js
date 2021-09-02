import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { listOrder, statusOrder } from '../../actions/orderActions'
import { ORDER_STATUS_RESET } from '../../constants/orderConstants'
import {
  message,
  Table,
  Tag,
  Space,
  Typography,
  Popconfirm,
  notification,
} from 'antd'

const OrderList = ({ history }) => {
  const { Column } = Table
  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const orderStatus = useSelector((state) => state.orderStatus)
  const { loading: loadingStatus, success: successStatus } = orderStatus

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (successStatus) {
      notification[status]({
        message: `Đã ${status === 'success' ? 'xác nhận' : 'hủy'} đơn hàng`,
      })
      dispatch({ type: ORDER_STATUS_RESET })
    }
    //dispatch({ type: ORDER_DETAILS_RESET })
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrder())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, successStatus])

  const orderStatusHandler = (id, status) => {
    dispatch(statusOrder(id, status))
  }

  return (
    <>
      {error && message.error({ content: `${error}`, duration: 2 })}
      {loading ? (
        <Loader />
      ) : (
        <Table
          rowKey={(record) => record._id}
          dataSource={orders}
          pagination={true}
          scroll={{ x: 1200, y: 400 }}>
          <Column
            title='ID'
            dataIndex='_id'
            key='_id'
            width='15%'
            render={(text) => <Link to={`/admin/order/${text}`}>{text}</Link>}
          />
          <Column
            title='NGÀY ĐẶT'
            dataIndex='createdAt'
            key='createdAt'
            render={(text) => (
              <Moment format='DD/MM/YYYY hh:mm:ss'>{text}</Moment>
            )}
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
            title='THANH TOÁN'
            dataIndex='isPaid'
            key='isPaid'
            render={(isPaid) => {
              let color = isPaid ? 'green' : 'red'
              let msg = isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
          <Column
            title='NHẬN HÀNG'
            dataIndex='isDelivered'
            key='isDelivered'
            render={(isDelivered) => {
              let color = isDelivered ? 'green' : 'red'
              let msg = isDelivered ? 'Đã nhận hàng' : 'Chưa nhận hàng'
              return <Tag color={color}>{msg}</Tag>
            }}
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
                  : status === 'ACCEPT'
                  ? 'blue'
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
                  ? 'Chờ xác nhận'
                  : status === 'ACCEPT'
                  ? 'Đã xác nhận'
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
            fixed='right'
            width='100'
            title='HÀNH ĐỘNG'
            dataIndex='action'
            key='action'
            render={(_, record) => {
              return (
                <Space size='middle'>
                  {record.status === 'WAIT' && (
                    <Typography.Link
                      onClick={() => {
                        orderStatusHandler(record._id, 'ACCEPT')
                        setStatus('success')
                      }}>
                      Xác nhận
                    </Typography.Link>
                  )}
                  {/* {record.status === 'ACCEPT' && (
                    <Typography.Link
                      onClick={() => {
                        orderStatusHandler(record._id, 'DELIVERY')
                        setStatus('success')
                      }}>
                      Giao hàng
                    </Typography.Link>
                  )}
                  {record.status === 'DELIVERY' && (
                    <>
                      <Typography.Link
                        onClick={() => {
                          orderStatusHandler(record._id, 'DELIVERY')
                          setStatus('success')
                        }}>
                        Đã giao hàng
                      </Typography.Link>
                      <Popconfirm
                        title='Hủy đơn hàng?'
                        onConfirm={() => {
                          orderStatusHandler(record._id, 'FAIL')
                          setStatus('error')
                        }}>
                        <a>Giao hàng thất bại</a>
                      </Popconfirm>
                    </>
                  )} */}
                  {record.status !== 'CANCEL' && record.status !== 'FINISH' && (
                    <Popconfirm
                      title='Chắc chắn hủy?'
                      onConfirm={() => {
                        orderStatusHandler(record._id, 'CANCEL')
                        setStatus('error')
                      }}>
                      <a>Hủy</a>
                    </Popconfirm>
                  )}
                  <Typography.Link
                    onClick={() => {
                      history.push(`/admin/order/${record._id}`)
                    }}>
                    Chi tiết
                  </Typography.Link>
                </Space>
              )
            }}></Column>
        </Table>
      )}
    </>
  )
}

export default OrderList
