import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { message, Table, Tag, Space } from 'antd'
import { getUserDetails, updateUserProfile } from '../../actions/userActions'
import Loader from '../../components/Loader'
import { listMyOrder } from '../../actions/orderActions'

const Orders = () => {
  const { Column } = Table

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading, error, orders } = orderListMy

  useEffect(() => {
    dispatch(listMyOrder())
  }, [dispatch, userInfo])

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
          pagination={false}
          scroll={{ x: '', y: 400 }}>
          <Column
            title='ID'
            dataIndex='_id'
            key='_id'
            render={(text) => <a href={`/order/${text}`}>{text}</a>}
          />
          <Column
            title='DATE'
            dataIndex='createdAt'
            key='createdAt'
            render={(text) => (
              <Moment format='DD/MM/YYYY hh:mm:ss'>{text}</Moment>
            )}
          />
          <Column
            title='TOTAL'
            dataIndex='totalPrice'
            key='totalPrice'
            render={(text) => <>$ {text}</>}
          />
          <Column
            title='PAID'
            dataIndex='isPaid'
            key='isPaid'
            render={(isPaid) => {
              let color = isPaid ? 'green' : 'red'
              let msg = isPaid ? 'Paid' : 'Not Paid'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
          <Column
            title='DELIVERED'
            dataIndex='isDelivered'
            key='isDelivered'
            render={(isDelivered) => {
              let color = isDelivered ? 'green' : 'red'
              let msg = isDelivered ? 'Delivered' : 'Not Delivered'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
        </Table>
      )}
    </>
  )
}

export default Orders
