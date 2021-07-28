import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
//import { Image } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import {
  Row,
  Col,
  Typography,
  Divider,
  Image,
  Button,
  InputNumber,
  Card,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'

const Cart = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (userInfo) {
      if (productId) {
        dispatch(addToCart(productId, qty))
      }
    } else if (productId) {
      history.push(`/login?redirect=/cart/${productId}?qty=${qty}`)
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push(`/shipping`)
  }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Divider orientation='left'>Shopping Cart</Divider>
        {cartItems.length === 0 ? (
          <Message message={`Your cart is empty`} />
        ) : (
          <>
            <Row gutter={16} justify='center' align='top'>
              {cartItems.map((item) => (
                <>
                  <Col span={5}>
                    <Image src={item.image} alt={item.name} width={150} />
                  </Col>
                  <Col span={6}>
                    <Typography.Text>
                      <Link to={`/product/${item.slug}`}> {item.name}</Link>
                    </Typography.Text>
                  </Col>
                  <Col span={3}>
                    <Typography.Title level={5}>Price</Typography.Title>
                    <Typography.Text>${item.price}</Typography.Text>
                  </Col>
                  <Col span={4}>
                    <Typography.Title level={5}>Quantity</Typography.Title>
                    <InputNumber
                      min={1}
                      max={item.countInStock}
                      defaultValue={item.qty}
                      onChange={(value) =>
                        dispatch(addToCart(item.product, value))
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Typography.Title level={5}>Total</Typography.Title>
                    <Typography.Text>${item.qty * item.price}</Typography.Text>
                  </Col>
                  <Col span={2}>
                    <Button
                      type='danger'
                      shape='circle'
                      size='small'
                      icon={<CloseOutlined />}
                      onClick={() => removeFromCartHandler(item.product)}
                    />
                  </Col>
                  <Divider />
                </>
              ))}
            </Row>
          </>
        )}
      </Col>
      <Col span={8}>
        <Divider orientation='left'>Checkout</Divider>
        <Card
          headStyle={{ fontSize: '25px' }}
          title={`Subtotal (${cartItems.reduce(
            (acc, item) => acc + item.qty,
            0
          )}) items`}>
          <Typography.Title level={4}>
            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}
          </Typography.Title>
          <Divider />
          <Button
            type='primary'
            shape='round'
            size='large'
            block
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}>
            Process to checkout
          </Button>
        </Card>
      </Col>
    </Row>
  )
}

export default Cart
