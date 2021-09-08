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
import {
  getImportOrderDetails,
  statusImportOrder,
  listImportOrder,
} from '../../actions/importActions'
import {
  IMPORT_DETAILS_RESET,
  IMPORT_STATUS_RESET,
} from '../../constants/importConstants'

const ImportDetails = ({ match, history }) => {
  const importOrderId = match.params.id
  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const importDetails = useSelector((state) => state.importDetails)
  const { importOrder, loading, error } = importDetails

  const importOrderStatus = useSelector((state) => state.importOrderStatus)
  const {
    loading: loadingStatus,
    success: successStatus,
    error: errorStatus,
  } = importOrderStatus

  const key = 'msg'
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      if (successStatus) {
        notification[status]({
          message: `Đã ${
            status === 'success' ? 'nhập hàng vào kho' : 'hủy phiếu nhập'
          }`,
        })
        dispatch({ type: IMPORT_STATUS_RESET })
        dispatch({ type: IMPORT_DETAILS_RESET })
        dispatch(listImportOrder())
        history.push('/admin/imports')
      }
      if (!importOrder || importOrder._id !== importOrderId)
        dispatch(getImportOrderDetails(importOrderId))
    }
  }, [userInfo, importOrderId, successStatus, importOrder])

  const orderStatusHandler = (id, status) => {
    dispatch(statusImportOrder(id, status))
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
            Phiếu nhập: {importOrder && importOrder._id}
          </Divider>

          <Button
            onClick={() => history.goBack()}
            type='primary'
            style={{ marginBottom: '5px' }}>
            Quay lại
          </Button>
          <Descriptions layout='vertical' bordered>
            <Descriptions.Item label='Phiếu nhập' span={3}>
              Mã: {importOrder && importOrder._id}
              <br />
              Ngày lập phiếu nhập:{' '}
              {
                <Moment format='DD/MM/YYYY hh:mm:ss'>
                  {importOrder && importOrder.createdAt}
                </Moment>
              }
              <br />
              Nhân viên lập phiếu nhập:{' '}
              {importOrder && importOrder.user && importOrder.user.name} -{' '}
              {importOrder && importOrder.user && importOrder.user.email}
            </Descriptions.Item>
            <Descriptions.Item label='Phiếu đặt' span={3}>
              Mã:{' '}
              {importOrder &&
                importOrder.orderSupplier &&
                importOrder.orderSupplier._id}{' '}
              -{' '}
              <Link
                to={`/admin/order-suppliers/${
                  importOrder &&
                  importOrder.orderSupplier &&
                  importOrder.orderSupplier._id
                }`}>
                Xem chi tiết
              </Link>
              <br />
              Ngày lập phiếu đặt:{' '}
              {
                <Moment format='DD/MM/YYYY hh:mm:ss'>
                  {importOrder &&
                    importOrder.orderSupplier &&
                    importOrder.orderSupplier.createdAt}
                </Moment>
              }
              <br />
              Nhân viên lập phiếu đặt:{' '}
              {importOrder &&
                importOrder.orderSupplier &&
                importOrder.orderSupplier.user &&
                importOrder.orderSupplier.user.name}{' '}
              -{' '}
              {importOrder &&
                importOrder.orderSupplier &&
                importOrder.orderSupplier.user &&
                importOrder.orderSupplier.user.email}
            </Descriptions.Item>
            <Descriptions.Item label='Danh sách sản phẩm nhập' span={3}>
              <Row justify='start' gutter={16} align='top'>
                {importOrder &&
                importOrder.importItems &&
                importOrder.importItems.length === 0 ? (
                  <Message message='Không có sản phẩm nào' />
                ) : (
                  importOrder &&
                  importOrder.importItems &&
                  importOrder.importItems.map((item) => (
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
                        <Typography.Title level={5}>
                          Đơn giá nhập
                        </Typography.Title>
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
                value={importOrder && importOrder.totalPrice}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              <sup>đ</sup>
            </Typography.Title>

            {importOrder && importOrder.status === 'WAIT' && (
              <>
                <Button
                  size='large'
                  type='primary'
                  shape='round'
                  block
                  style={{ marginBottom: '5px' }}
                  onClick={() => {
                    orderStatusHandler(importOrder._id, 'FINISH')
                    setStatus('success')
                  }}>
                  Xác nhận lập phiếu nhập
                </Button>
                <Button
                  size='large'
                  type='danger'
                  shape='round'
                  block
                  onClick={() => {
                    orderStatusHandler(importOrder._id, 'CANCEL')
                    setStatus('error')
                  }}>
                  Hủy
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ImportDetails
