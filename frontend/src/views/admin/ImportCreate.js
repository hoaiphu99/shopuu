import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
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
  Select,
} from 'antd'
import { getOrderSupplierDetails } from '../../actions/orderSupplierActions'
import { ORDER_SUPPLIER_DETAILS_RESET } from '../../constants/orderSupplierConstants'
import { createImport } from '../../actions/importActions'
import { IMPORT_CREATE_RESET } from '../../constants/importConstants'

const ImportCreate = ({ match, history }) => {
  const orderSupplierId = match.params.id

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderSupplierDetails = useSelector(
    (state) => state.orderSupplierDetails
  )
  const { orderSupplier, loading, error } = orderSupplierDetails

  const importCreate = useSelector((state) => state.importCreate)
  const {
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
  } = importCreate

  const key = 'msg'
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      if (successCreate) {
        message.success({
          content: 'Lập phiếu nhập thành công!',
          key,
          duration: 2,
        })
        dispatch({ type: IMPORT_CREATE_RESET })
        history.push('/admin/imports')
      }
      if (!orderSupplier || orderSupplier._id !== orderSupplierId)
        dispatch(getOrderSupplierDetails(orderSupplierId))
    }

    // if (successStatus) {
    //   notification({
    //     message: `Đã nhập hàng thành công!`,
    //   })
    //   dispatch({ type: ORDER_SUPPLIER_DETAILS_RESET })
    //   dispatch(getOrderSupplierDetails(orderSupplierId))
    // }
  }, [userInfo, orderSupplierId, successCreate])

  const importHandler = () => {
    const importItems = []
    orderSupplier.orderItems.map((item) => {
      importItems.push({
        product: item.product._id,
        qty: item.qty,
        price: item.price,
      })
    })
    const data = {
      orderSupplier: orderSupplier._id,
      importItems,
      totalPrice: orderSupplier.totalPrice,
    }
    console.log(data)
    dispatch(createImport(data))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      {loadingCreate &&
        message.loading({ content: 'Đang tạo...', key, duration: 10 })}
      {errorCreate &&
        message.error({ content: `${errorCreate}`, key, duration: 2 })}
      <Row gutter={16}>
        <Col span={16}>
          <Divider orientation='left'>Lập phiếu nhập hàng</Divider>

          <Button
            onClick={() => history.goBack()}
            type='primary'
            style={{ marginBottom: '5px' }}>
            Quay lại
          </Button>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Phiếu đặt' span={3}>
              Mã: {orderSupplier && orderSupplier._id}
              <br />
              Ngày lập phiếu đặt:{' '}
              {
                <Moment format='DD/MM/YYYY hh:mm:ss'>
                  {orderSupplier && orderSupplier.createdAt}
                </Moment>
              }
              <br />
              Nhân viên lập phiếu đặt:{' '}
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
                {orderSupplier.orderItems &&
                orderSupplier.orderItems.length === 0 ? (
                  <Message message='Không có sản phẩm nào' />
                ) : (
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

            {orderSupplier.status === 'ACCEPT' && (
              <>
                <Button
                  size='large'
                  type='primary'
                  shape='round'
                  block
                  onClick={() => {
                    importHandler()
                  }}>
                  Xác nhận lập phiếu nhập
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ImportCreate
