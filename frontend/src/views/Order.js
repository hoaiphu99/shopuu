import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import NumberFormat from 'react-number-format'
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
  Modal,
  Rate,
  Form,
  Input,
  notification,
} from 'antd'
import {
  getOrderDetails,
  statusOrder,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import { createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_STATUS_RESET,
} from '../constants/orderConstants'

const Order = ({ match, history }) => {
  const orderId = match.params.id

  const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tuyệt vời']
  const { confirm } = Modal
  const [productId, setProductId] = useState('')
  const [rating, setRating] = useState(0)
  const [sdkReady, setSdkReady] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  // Calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderStatus = useSelector((state) => state.orderStatus)
  const { loading: loadingStatus, success: successStatus } = orderStatus

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate

  if (!loading) {
    // Calculate price
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      )
    )
  }
  const key = 'msg'
  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    dispatch(getOrderDetails(orderId))
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
    if (successStatus) {
      notification[status]({
        message: `Đã ${status === 'success' ? 'thanh toán' : 'hủy'} đơn hàng`,
      })
      dispatch({ type: ORDER_STATUS_RESET })
      dispatch(getOrderDetails(orderId))
    }
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid && order.paymentMethod === 'PayPal') {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    } else {
    }
    if (successProductReview) {
      setIsModalVisible(false)
      message.success({ content: 'Cảm ơn bạn đã đánh giá!', key, duration: 2 })
      setRating(0)
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [
    userInfo,
    orderId,
    successPay,
    successDeliver,
    successProductReview,
    successStatus,
  ])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId))
  }

  const submitHandler = (values, id) => {
    const data = {
      rating,
      comment: values.comment,
    }
    dispatch(createProductReview(id, data))
  }
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const orderStatusHandler = (id, status) => {
    dispatch(statusOrder(id, status))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>Đơn hàng: #{order && order._id}</Divider>
          <Link to='/profile/orders'>
            <Button
              type='primary'
              shape='round'
              style={{ marginBottom: '5px' }}>
              Quay lại danh sách đơn hàng
            </Button>
          </Link>

          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Địa chỉ giao hàng' span={3}>
              {order && order.shippingAddress && order.shippingAddress.address},{' '}
              {order && order.shippingAddress && order.shippingAddress.city},{' '}
              {order && order.shippingAddress && order.shippingAddress.district}
              , {order && order.shippingAddress && order.shippingAddress.ward}
            </Descriptions.Item>
            <Descriptions.Item label='Phương thức thanh toán'>
              {order.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label='Giá đơn hàng'>
              <NumberFormat
                value={order.totalPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              <sup>đ</sup>
            </Descriptions.Item>
            <Descriptions.Item label='Giá vận chuyển'>
              <NumberFormat
                value={order.shippingPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              <sup>đ</sup>
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái' span={3}>
              <TimelineComp
                created={order.createdAt}
                status={{ statusName: order.status, date: order.updatedAt }}
                paid={order.isPaid ? order.paidAt : null}
                delivered={order.isDelivered ? order.deliveredAt : null}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Danh sách sản phẩm' span={3}>
              {loadingProductReview &&
                message.loading({ content: 'Đang thêm...', key, duration: 10 })}
              {errorProductReview &&
                message.error({
                  content: `${errorProductReview}`,
                  key,
                  duration: 2,
                })}
              <Row justify='start' gutter={16} align='top'>
                {order.orderItems.length === 0 ? (
                  <Message message='Không có sản phẩm nào' />
                ) : (
                  order.orderItems.map((item) => (
                    <>
                      <Col span={6}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={150}
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>
                          <Link
                            to={`/${item.product.category.slug}/${item.product.slug}`}
                            target='_blank'>
                            {' '}
                            {item.product.name}
                          </Link>
                        </Typography.Text>
                      </Col>
                      <Col span={3}>
                        <Typography.Title level={5}>Giá</Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.product.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />{' '}
                          <sup>đ</sup>
                        </Typography.Text>
                      </Col>
                      <Col span={4}>
                        <Typography.Title level={5}>Tổng cộng</Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.qty * item.product.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />{' '}
                          <sup>đ</sup>
                        </Typography.Text>
                      </Col>
                      {order.isPaid && order.isDelivered && (
                        <Button
                          onClick={() => {
                            showModal()
                            setProductId(item.product._id)
                          }}
                          type='primary'
                          shape='round'
                          block>
                          Đánh giá sản phẩm
                        </Button>
                      )}
                      <Divider />
                    </>
                  ))
                )}
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={8}>
          <Divider orientation='left'>Đơn hàng</Divider>
          <Card>
            <Typography.Title level={4}>
              Tổng giá:{' '}
              <NumberFormat
                value={order.totalPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              <sup>đ</sup>
            </Typography.Title>
            {order.status === 'WAIT' && (
              <Button
                size='large'
                type='danger'
                shape='round'
                block
                onClick={() => {
                  orderStatusHandler(order._id, 'CANCEL')
                  setStatus('error')
                }}>
                Hủy đơn hàng
              </Button>
            )}
            {order.status === 'CANCEL' && (
              <Typography.Title level={4}>Đơn hàng đã bị hủy</Typography.Title>
            )}
            {order.status === 'ACCEPT' &&
              order.paymentMethod === 'PayPal' &&
              !order.isPaid && (
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

            {order.status === 'ACCEPT' &&
              order.paymentMethod === 'COD' &&
              !order.isPaid && (
                <>
                  {loadingStatus && <Loader />}
                  <Button
                    size='large'
                    type='primary'
                    shape='round'
                    block
                    onClick={() => {
                      orderStatusHandler(order._id, 'FINISH')
                      setStatus('success')
                    }}>
                    Xác nhận đã thanh toán và nhận hàng
                  </Button>
                </>
              )}
            {loadingDeliver && <Loader />}
            {order.status === 'ACCEPT' &&
              order.paymentMethod === 'PayPal' &&
              userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <Button
                  size='large'
                  type='primary'
                  shape='round'
                  block
                  onClick={deliverHandler}>
                  Xác nhận đã nhận hàng
                </Button>
              )}
          </Card>
        </Col>
      </Row>
      <Modal
        title='Hãy để lại đánh giá của bạn'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          <span>
            <Rate
              tooltips={desc}
              onChange={(value) => setRating(value)}
              value={rating}
            />
            {rating ? (
              <span className='ant-rate-text'>{desc[rating - 1]}</span>
            ) : (
              ''
            )}
          </span>
          <Form
            name='basic'
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
            onFinish={(values) => submitHandler(values, productId)}>
            <Form.Item
              name='comment'
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập đánh giá!',
                },
              ]}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 18 }}>
              <Button type='primary' htmlType='submit'>
                Đánh giá
              </Button>
            </Form.Item>
          </Form>{' '}
        </>
      </Modal>
    </>
  )
}

export default Order
