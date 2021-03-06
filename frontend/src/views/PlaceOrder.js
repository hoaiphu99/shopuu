import React, { useEffect } from 'react'
import NumberFormat from 'react-number-format'
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
      history.push(`/order-success/${order._id}`)
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
        <Col span={16} offset={4}>
          <CheckoutSteps step1 step2 step3 step4 />
          <Divider />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>Thanh to??n ????n h??ng</Divider>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='?????a ch??? v?? ng?????i nh???n h??ng' span={3}>
              {user && user.name},{' '}
              {user && user.shippingAddress && user.shippingAddress.address},{' '}
              {user && user.shippingAddress && user.shippingAddress.city},{' '}
              {user && user.shippingAddress && user.shippingAddress.district},{' '}
              {user && user.shippingAddress && user.shippingAddress.ward}
            </Descriptions.Item>
            <Descriptions.Item label='Ph????ng th???c thanh to??n'>
              {cart.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label='T???ng gi?? s???n ph???m'>
              <NumberFormat
                value={cart.itemsPrice}
                displayType={'text'}
                thousandSeparator={true}
              />
              <sup>??</sup>
            </Descriptions.Item>
            <Descriptions.Item label='Ph?? v???n chuy???n'>
              <NumberFormat
                value={cart.shippingPrice}
                displayType={'text'}
                thousandSeparator={true}
              />
              <sup>??</sup>
            </Descriptions.Item>

            <Descriptions.Item label='S???n ph???m'>
              <Row justify='start' align='top'>
                {cart.cartItems.length === 0 ? (
                  <Message message='Kh??ng c?? s???n ph???m' />
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
                        <Typography.Title level={5}>Gi??</Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                          <sup>??</sup>
                        </Typography.Text>
                      </Col>
                      <Col span={4}>
                        <Typography.Title level={5}>T???ng c???ng</Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.qty * item.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                          <sup>??</sup>
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
          <Divider orientation='left'>????n h??ng</Divider>
          <Card>
            <Typography.Title level={4}>
              T???ng ti???n:{' '}
              <NumberFormat
                value={cart.totalPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              VN??
            </Typography.Title>

            <Button
              size='large'
              type='primary'
              shape='round'
              block
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}>
              X??c nh???n ?????t h??ng
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrder
