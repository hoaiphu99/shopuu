import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import TimelineComp from '../../components/TimelineComp'
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
  Modal,
  Rate,
  Form,
  Input,
  notification,
} from 'antd'
import {
  getOrderSupplierDetails,
  statusOrderSupplier,
  listOrderSuppliers,
} from '../../actions/orderSupplierActions'
import {
  ORDER_SUPPLIER_DETAILS_RESET,
  ORDER_SUPPLIER_STATUS_RESET,
} from '../../constants/orderSupplierConstants'

const OrderSupplierDetails = ({ match, history }) => {
  const orderSupplierId = match.params.id
  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderSupplierDetails = useSelector(
    (state) => state.orderSupplierDetails
  )
  const { orderSupplier, loading, error } = orderSupplierDetails

  const orderSupplierStatus = useSelector((state) => state.orderSupplierStatus)
  const {
    loading: loadingStatus,
    success: successStatus,
    error: errorStatus,
  } = orderSupplierStatus

  const key = 'msg'
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      if (!orderSupplier || orderSupplier._id !== orderSupplierId)
        dispatch(getOrderSupplierDetails(orderSupplierId))
    }

    if (successStatus) {
      notification[status]({
        message: `Đã ${status === 'success' ? 'xác nhận' : 'hủy phiếu đặt'}`,
      })
      dispatch({ type: ORDER_SUPPLIER_DETAILS_RESET })
      dispatch({ type: ORDER_SUPPLIER_STATUS_RESET })
      dispatch(getOrderSupplierDetails(orderSupplierId))
      dispatch(listOrderSuppliers())
    }
  }, [userInfo, orderSupplierId, successStatus])

  const orderStatusHandler = (id, status) => {
    dispatch(statusOrderSupplier(id, status))
  }

  const importHandler = (id) => {
    history.push(`/admin/imports/create/${id}`)
    //dispatch(statusOrder(id, status))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      {errorStatus &&
        message.error({ content: `${errorStatus}`, key, duration: 2 })}
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>
            Phiếu đặt #{orderSupplier && orderSupplier._id}
          </Divider>

          <Button
            onClick={() => history.goBack()}
            type='primary'
            style={{ marginBottom: '5px' }}>
            Quay lại
          </Button>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Nhân viên lập phiếu' span={3}>
              {orderSupplier.user && orderSupplier.user.name} -{' '}
              {orderSupplier.user && orderSupplier.user.email}
            </Descriptions.Item>
            <Descriptions.Item label='Nhà cung cấp' span={3}>
              {orderSupplier.supplier && orderSupplier.supplier.name} -{' '}
              {orderSupplier.supplier && orderSupplier.supplier.phone}
              <br /> Địa chỉ:{' '}
              {orderSupplier.supplier &&
                orderSupplier.supplier.supplierAddress &&
                orderSupplier.supplier.supplierAddress.address}
              ,{' '}
              {orderSupplier.supplier &&
                orderSupplier.supplier.supplierAddress &&
                orderSupplier.supplier.supplierAddress.city}
              ,{' '}
              {orderSupplier.supplier &&
                orderSupplier.supplier.supplierAddress &&
                orderSupplier.supplier.supplierAddress.district}
              ,{' '}
              {orderSupplier.supplier &&
                orderSupplier.supplier.supplierAddress &&
                orderSupplier.supplier.supplierAddress.ward}
            </Descriptions.Item>

            <Descriptions.Item label='Danh sách sản phẩm' span={3}>
              <Row justify='start' gutter={16} align='top'>
                {orderSupplier &&
                orderSupplier.orderItems &&
                orderSupplier.orderItems.length === 0 ? (
                  <Message message='Không có sản phẩm nào' />
                ) : (
                  orderSupplier &&
                  orderSupplier.orderItems &&
                  orderSupplier.orderItems.map((item) => (
                    <>
                      <Col span={6}>
                        <Image
                          src={item.product.images[0].imageLink}
                          alt={item.product.name}
                          width='100%'
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>{item.product.name}</Typography.Text>
                      </Col>
                      <Col span={4}>
                        <Typography.Title level={5}>Giá nhập</Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                          <sup>đ</sup>
                        </Typography.Text>
                      </Col>
                      <Col span={6}>
                        <Typography.Title level={5}>
                          Số lượng nhập
                        </Typography.Title>
                        <Typography.Text>
                          <NumberFormat
                            value={item.qty}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </Typography.Text>
                      </Col>
                      <Col span={8}>
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

                      <Divider />
                    </>
                  ))
                )}
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={8}>
          <Divider orientation='left'></Divider>
          <Card>
            <Typography.Title level={4}>
              Tổng giá:{' '}
              <NumberFormat
                value={orderSupplier.totalPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              <sup>đ</sup>
            </Typography.Title>

            {orderSupplier.status === 'WAIT' && (
              <>
                <Button
                  size='large'
                  type='primary'
                  shape='round'
                  block
                  style={{ marginBottom: '5px' }}
                  onClick={() => {
                    orderStatusHandler(orderSupplier._id, 'ACCEPT')
                    setStatus('success')
                  }}>
                  Xác nhận đã nhận hàng
                </Button>
                <Button
                  size='large'
                  type='danger'
                  shape='round'
                  block
                  onClick={() => {
                    orderStatusHandler(orderSupplier._id, 'CANCEL')
                    setStatus('error')
                  }}>
                  Hủy
                </Button>
              </>
            )}
            {orderSupplier.status === 'ACCEPT' && (
              <Button
                size='large'
                type='primary'
                shape='round'
                block
                onClick={() => {
                  importHandler(orderSupplier._id)
                }}>
                Lập phiếu nhập
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderSupplierDetails
