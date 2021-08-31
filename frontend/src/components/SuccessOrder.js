import React from 'react'
import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'

const SuccessOrder = ({ orderId }) => {
  return (
    <Result
      status='success'
      title='Đặt hàng thành công!'
      subTitle={`Mã đơn hàng: #${orderId}`}
      extra={[
        <Link to={`/order/${orderId}`}>
          <Button type='primary' key='console'>
            Xem đơn hàng
          </Button>
        </Link>,
        <Link to='/'>
          <Button key='buy'>Tiếp tục mua sắm</Button>
        </Link>,
      ]}
    />
  )
}

export default SuccessOrder
