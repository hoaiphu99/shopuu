import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
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
  }, [dispatch, productId, qty, userInfo])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push(`/shipping`)
  }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Divider orientation='left'>Giỏ hàng</Divider>
        {cartItems.length === 0 ? (
          <Message message={`Giỏ hàng trống`} />
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
                    <Typography.Title level={5}>Giá</Typography.Title>
                    <Typography.Text>
                      <NumberFormat
                        value={item.price}
                        displayType={'text'}
                        thousandSeparator={true}
                      />
                      <sup>đ</sup>
                    </Typography.Text>
                  </Col>
                  <Col span={4}>
                    <Typography.Title level={5}>Số lượng</Typography.Title>
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
                    <Typography.Title level={5}>Tổng cộng</Typography.Title>
                    <Typography.Text>
                      <NumberFormat
                        value={item.qty * item.price}
                        displayType={'text'}
                        thousandSeparator={true}
                      />
                      <sup>đ</sup>
                    </Typography.Text>
                  </Col>
                  <Col span={2}>
                    <Button
                      type='danger'
                      shape='circle'
                      size='small'
                      icon={
                        <CloseOutlined
                          type='play-circle-o'
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'text-top',
                          }}
                        />
                      }
                      onClick={() => removeFromCartHandler(item.product)}
                    />
                  </Col>
                  <Divider />
                </>
              ))}
            </Row>
          </>
        )}
        <Link to='/'>
          <Button
            type='primary'
            shape='round'
            size='large'
            onClick={checkoutHandler}
            style={{ marginTop: '5px' }}>
            Tiếp tục mua hàng
          </Button>
        </Link>
      </Col>
      <Col span={8}>
        <Divider orientation='left'>Thanh toán</Divider>
        <Card
          headStyle={{ fontSize: '25px' }}
          title={`Tổng cộng (${cartItems.reduce(
            (acc, item) => acc + item.qty,
            0
          )}) sản phẩm`}>
          <Typography.Title level={4}>
            <NumberFormat
              value={cartItems.reduce(
                (acc, item) => acc + item.qty * item.price,
                0
              )}
              displayType={'text'}
              thousandSeparator={true}
            />{' '}
            VNĐ
          </Typography.Title>
          <Divider />
          <Button
            type='primary'
            shape='round'
            size='large'
            block
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}>
            Tiến hành thanh toán
          </Button>
        </Card>
      </Col>
    </Row>
  )
}

export default Cart
