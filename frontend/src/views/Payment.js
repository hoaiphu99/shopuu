import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { Row, Col, Radio, Space, Button, Divider } from 'antd'

const Payment = ({ history }) => {
  // const cart = useSelector((state) => state.cart)
  // const { shippingAddress } = cart

  const userDetails = useSelector((state) => state.userDetails)
  const {
    user: { shippingAddress },
  } = userDetails

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = () => {
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <>
      <Row>
        <Col span={16} offset={4}>
          <CheckoutSteps step1 step2 step3 />
          <Divider />
        </Col>
      </Row>
      <Space direction='vertical'>
        <Row>
          <Col span={12} offset={10}>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}>
              <Space direction='vertical'>
                <Radio value='COD'>Ship COD</Radio>
                <Radio value='PayPal'>PayPal</Radio>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={10}>
            <Button type='primary' onClick={submitHandler}>
              Continue
            </Button>
          </Col>
        </Row>
      </Space>
    </>
  )
}

export default Payment
