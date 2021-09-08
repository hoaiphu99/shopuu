import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'
import Breadcrumb from '../../components/BreadcrumbComp'
import NumberFormat from 'react-number-format'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { listImportOrder, statusImportOrder } from '../../actions/importActions'
import { IMPORT_STATUS_RESET } from '../../constants/importConstants'
import {
  message,
  Table,
  Tag,
  Space,
  Typography,
  Popconfirm,
  Select,
  Button,
  notification,
} from 'antd'

const ImportList = ({ history }) => {
  const { Column } = Table
  const { Option } = Select

  const [status, setStatus] = useState('')
  const dispatch = useDispatch()

  const importList = useSelector((state) => state.importList)
  const { loading, error, imports } = importList

  const importOrderStatus = useSelector((state) => state.importOrderStatus)
  const { loading: loadingStatus, success: successStatus } = importOrderStatus

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (successStatus) {
        notification[status]({
          message: `Đã ${
            status === 'success' ? 'nhập hàng vào kho' : 'hủy phiếu nhập'
          }`,
        })
        dispatch({ type: IMPORT_STATUS_RESET })
        dispatch(listImportOrder())
      }
      if (!imports) dispatch(listImportOrder())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, imports, successStatus])

  const orderStatusHandler = (id, status) => {
    dispatch(statusImportOrder(id, status))
  }

  return (
    <>
      <Breadcrumb link1='Admin' link2='Phiếu đặt hàng' />
      <Button
        type='primary'
        onClick={() => {
          history.push('/admin/order-suppliers')
        }}
        style={{
          marginBottom: 16,
        }}>
        Lập phiếu nhập hàng
      </Button>

      {error && message.error({ content: `${error}`, duration: 2 })}
      {loading ? (
        <Loader />
      ) : (
        <Table
          rowKey={(record) => record._id}
          dataSource={imports}
          pagination={true}
          scroll={{ x: 1200, y: 400 }}>
          <Column
            title='ID'
            dataIndex='_id'
            key='_id'
            width='15%'
            render={(text) => <Link to={`/admin/imports/${text}`}>{text}</Link>}
          />
          <Column
            title='NHÂN VIÊN LẬP'
            dataIndex='user'
            key='user'
            render={(user) => {
              return user.name
            }}
          />
          <Column
            title='NGÀY LẬP'
            dataIndex='createdAt'
            key='createdAt'
            render={(text) => (
              <Moment format='DD/MM/YYYY hh:mm:ss'>{text}</Moment>
            )}
          />
          <Column
            title='TRẠNG THÁI'
            dataIndex='status'
            key='status'
            render={(status) => {
              let color =
                status === 'CANCEL'
                  ? 'red'
                  : status === 'WAIT'
                  ? 'orange'
                  : // : status === 'DELIVERY'
                    // ? 'cyan'
                    // : status === 'DELIVERED'
                    // ? 'geekblue'
                    // : status === 'FAIL'
                    // ? 'red'
                    'green'
              let msg =
                status === 'CANCEL'
                  ? 'Đã hủy'
                  : status === 'WAIT'
                  ? 'Chưa nhập hàng'
                  : // : status === 'DELIVERY'
                    // ? 'Đang giao hàng'
                    // : status === 'DELIVERED'
                    // ? 'Giao hàng thành công'
                    // : status === 'FAIL'
                    // ? 'Giao hàng thất bại'
                    'Đã nhập hàng'
              return <Tag color={color}>{msg}</Tag>
            }}
          />
          <Column
            title='TỔNG GIÁ'
            dataIndex='totalPrice'
            key='totalPrice'
            render={(text) => (
              <>
                <NumberFormat
                  value={text}
                  displayType={'text'}
                  thousandSeparator={true}
                />{' '}
                <sup>đ</sup>
              </>
            )}
          />
          <Column
            title='PHIẾU ĐẶT'
            dataIndex='orderSupplier'
            key='orderSupplier'
            render={(orderSupplier) => {
              return (
                <Link to={`/admin/order-suppliers/${orderSupplier._id}`}>
                  {orderSupplier._id}
                </Link>
              )
            }}
          />

          <Column
            fixed='right'
            width='15%'
            title='HÀNH ĐỘNG'
            dataIndex='action'
            key='action'
            render={(_, record) => {
              return (
                <Space size='middle'>
                  {record.status === 'WAIT' && (
                    <Typography.Link
                      onClick={() => {
                        orderStatusHandler(record._id, 'FINISH')
                        setStatus('success')
                      }}>
                      Nhập hàng
                    </Typography.Link>
                  )}
                  <Typography.Link
                    onClick={() => {
                      history.push(`/admin/imports/${record._id}`)
                    }}>
                    Chi tiết
                  </Typography.Link>
                  {record.status !== 'CANCEL' && record.status !== 'FINISH' && (
                    <Popconfirm
                      title='Chắc chắn hủy?'
                      onConfirm={() => {
                        orderStatusHandler(record._id, 'CANCEL')
                        setStatus('error')
                      }}>
                      <a>Hủy</a>
                    </Popconfirm>
                  )}
                </Space>
              )
            }}></Column>
        </Table>
      )}
    </>
  )
}

export default ImportList
