import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format'
import { Link } from 'react-router-dom'
import { message, Table, Tag, Space, Typography, Popconfirm } from 'antd'
import { getUserDetails, updateUserProfile } from '../../actions/userActions'
import Loader from '../../components/Loader'
import { listMyOrder } from '../../actions/orderActions'

const Orders = ({ history }) => {
  const { Column } = Table

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading, error, orders } = orderListMy

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyOrder())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <>
      {error && message.error({ content: `${error}`, duration: 2 })}
      {loading ? (
        <Loader />
      ) : (
        <Table
          rowKey={(record) => record._id}
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <p style={{ margin: 0 }}>{record._id}</p>
          //   ),
          //   rowExpandable: (record) => record._id.toString() !== ' ',
          // }}
          dataSource={orders}
          pagination={true}
          scroll={{ x: '', y: 400 }}>
          <Column
            title='ID'
            dataIndex='_id'
            key='_id'
            width='15%'
            render={(text) => <Link to={`/order/${text}`}>{text}</Link>}
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
                  : 'green'
              let msg =
                status === 'CANCEL'
                  ? 'Đã hủy'
                  : status === 'WAIT'
                  ? 'Chờ xác nhận'
                  : status === 'ACCEPT'
                  ? 'Đã xác nhận'
                  : 'Hoàn thành'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
        </Table>
      )}
    </>
  )
}

export default Orders
