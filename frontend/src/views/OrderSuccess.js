import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import SuccessOrder from '../components/SuccessOrder'

const OrderSuccess = ({ history, match }) => {
  const orderId = match.params.orderId
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [userInfo, orderId])
  return <SuccessOrder orderId={orderId} />
}

export default OrderSuccess
