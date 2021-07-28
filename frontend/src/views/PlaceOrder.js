import React, { useState, useEffect } from 'react'
// import {
//   Row,
//   Col,
//   ListGroup,
//   Image,
//   Card,
//   Button,
//   ListGroupItem,
// } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'
import { removeAllFromCart } from '../actions/cartActions'
import { getUserDetails } from '../actions/userActions'
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

const PlaceOrder = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)

  // Calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.totalPrice = (
    Number(cart.itemsPrice) + Number(cart.shippingPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, user } = userDetails

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(getUserDetails('profile'))
    }
    if (success) {
      dispatch(removeAllFromCart())
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    console.log(user.shippingAddress)
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: user.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <CheckoutSteps step1 step2 step3 step4 />
          <Divider />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>Place Order</Divider>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Address' span={3}>
              {user && user.shippingAddress && user.shippingAddress.address},{' '}
              {user && user.shippingAddress && user.shippingAddress.city},{' '}
              {user && user.shippingAddress && user.shippingAddress.district},{' '}
              {user && user.shippingAddress && user.shippingAddress.ward}
            </Descriptions.Item>
            <Descriptions.Item label='Payment Method'>
              {cart.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label='Items Price'>
              ${cart.itemsPrice}
            </Descriptions.Item>
            <Descriptions.Item label='Shipping Price'>
              ${cart.shippingPrice}
            </Descriptions.Item>

            <Descriptions.Item label='Order Items'>
              <Row justify='start' align='top'>
                {cart.cartItems.length === 0 ? (
                  <Message message='Your cart is empty' />
                ) : (
                  cart.cartItems.map((item) => (
                    <>
                      <Col span={6}>
                        <Image src={item.image} alt={item.name} width={150} />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>
                          <Link to={`/product/${item.slug}`} target='_blank'>
                            {' '}
                            {item.name}
                          </Link>
                        </Typography.Text>
                      </Col>
                      <Col span={3}>
                        <Typography.Title level={5}>Price</Typography.Title>
                        <Typography.Text>${item.price}</Typography.Text>
                      </Col>
                      <Col span={4}>
                        <Typography.Title level={5}>Total</Typography.Title>
                        <Typography.Text>
                          ${item.qty * item.price}
                        </Typography.Text>
                      </Col>
                      <Divider />
                    </>
                  ))
                )}
              </Row>
            </Descriptions.Item>
          </Descriptions>
          {/* <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {user.shippingAddress && user.shippingAddress.address},{' '}
                {user.shippingAddress && user.shippingAddress.city},{' '}
                {user.shippingAddress && user.shippingAddress.district},{' '}
                {user.shippingAddress && user.shippingAddress.ward}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup> */}
        </Col>

        <Col span={8}>
          <Divider orientation='left'>Order Summary</Divider>
          <Card>
            <Typography.Title level={4}>
              Total Price: ${cart.totalPrice}
            </Typography.Title>

            <Button
              size='large'
              type='primary'
              shape='round'
              block
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}>
              Place Order
            </Button>
          </Card>

          {/* <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Button
                    type='button'
                    className='btn btn-dark btn-lg'
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card> */}
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrder
