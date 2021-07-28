import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
//import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import TimelineComp from '../components/TimelineComp'
import {
  Row,
  Col,
  Descriptions,
  Card,
  Badge,
  Button,
  message,
  Divider,
  Typography,
  Image,
} from 'antd'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const Order = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  // Calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  if (!loading) {
    // Calculate price
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      )
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, userInfo, orderId, successPay, successDeliver, order])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>Order: #{order && order._id}</Divider>
          <Link to='/profile/orders'>
            <Button type='primary'>Go back to orders</Button>
          </Link>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Address' span={3}>
              {order && order.shippingAddress && order.shippingAddress.address},{' '}
              {order && order.shippingAddress && order.shippingAddress.city},{' '}
              {order && order.shippingAddress && order.shippingAddress.district}
              , {order && order.shippingAddress && order.shippingAddress.ward}
            </Descriptions.Item>
            <Descriptions.Item label='Payment Method'>
              {order.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label='Items Price'>
              ${order.itemsPrice}
            </Descriptions.Item>
            <Descriptions.Item label='Shipping Price'>
              ${order.shippingPrice}
            </Descriptions.Item>
            <Descriptions.Item label='Timeline' span={3}>
              <TimelineComp
                created={order.createdAt}
                status={{ statusName: order.status, date: order.updatedAt }}
                paid={order.isPaid ? order.paidAt : null}
                delivered={order.isDelivered ? order.deliveredAt : null}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Order Items' span={3}>
              <Row justify='start' align='top'>
                {order.orderItems.length === 0 ? (
                  <Message message='Your order is empty' />
                ) : (
                  order.orderItems.map((item) => (
                    <>
                      <Col span={6}>
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={150}
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>
                          <Link
                            to={`/product/${item.product.slug}`}
                            target='_blank'>
                            {' '}
                            {item.product.name}
                          </Link>
                        </Typography.Text>
                      </Col>
                      <Col span={3}>
                        <Typography.Title level={5}>Price</Typography.Title>
                        <Typography.Text>${item.product.price}</Typography.Text>
                      </Col>
                      <Col span={4}>
                        <Typography.Title level={5}>Total</Typography.Title>
                        <Typography.Text>
                          ${item.qty * item.product.price}
                        </Typography.Text>
                      </Col>
                      <Divider />
                    </>
                  ))
                )}
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={8}>
          <Divider orientation='left'>Order Summary</Divider>
          <Card>
            <Typography.Title level={4}>
              Total Price: ${order.totalPrice}
            </Typography.Title>
            {!order.isPaid && (
              <>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}></PayPalButton>
                )}
              </>
            )}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <Button
                  size='large'
                  type='primary'
                  shape='round'
                  block
                  onClick={deliverHandler}>
                  Make as Delivered
                </Button>
              )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Order
