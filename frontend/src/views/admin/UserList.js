import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//import Moment from 'react-moment'
//import { Link } from 'react-router-dom'
import {
  message,
  Table,
  Space,
  Typography,
  Input,
  Popconfirm,
  Form,
  Button,
  Tag,
} from 'antd'
// import {
//   HighlightOutlined,
//   SmileOutlined,
//   SmileFilled,
// } from '@ant-design/icons'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
//import UserEdit from './UserEdit'
import {
  listUsers,
  deleteUser,
  // getUserDetails,
  // updateUser,
} from '../../actions/userActions'
import {
  // USER_CREATE_RESET,
  // USER_UPDATE_RESET,
  USER_DELETE_RESET,
} from '../../constants/userConstants'

const UserList = ({ history }) => {
  // const { Paragraph } = Typography
  // const { Column } = Table

  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  //const [editingKey, setEditingKey] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userDetails = useSelector((state) => state.userDetails)
  //const { user } = userDetails

  const userDelete = useSelector((state) => state.userDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = userDelete

  const key = 'msg'

  const [form] = Form.useForm()

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!users || users.length <= 0) {
        dispatch(listUsers())
      } else if (successDelete) {
        message.success({ content: 'Đã xóa!', key, duration: 2 })
        dispatch({ type: USER_DELETE_RESET })
        dispatch(listUsers())
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, users, successDelete])

  // const handleUpdate = (record) => {}

  // const handleCreate = (values) => {
  //   setIsAdd(!isAdd)
  // }

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
  }

  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Họ tên',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 80,
    },
    {
      title: 'Quyền',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 50,
      render: (isAdmin) => {
        let color = isAdmin ? 'red' : 'blue'
        let msg = isAdmin ? 'Admin' : 'User'
        return <Tag color={color}>{msg}</Tag>
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 60,
      render: (_, record) => {
        return (
          <Space size='middle'>
            <Typography.Link onClick={() => edit(record)}>
              Chi tiết
            </Typography.Link>
            <Popconfirm
              title='Chắc chắn xóa?'
              onConfirm={() => handleDelete(record._id)}>
              <a>Xóa</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const edit = (record) => {
    //console.log(record)
    history.push(`users/${record._id}`)
  }

  return (
    <>
      <div>
        <Breadcrumb link1='Admin' link2='Người dùng' />
        <Button
          type='primary'
          onClick={() => {
            history.push('/admin/users/create')
          }}
          style={{
            marginBottom: 16,
          }}>
          {isEdit ? 'Trở về' : !isAdd ? 'Thêm mới' : 'Hủy'}
        </Button>
        {loadingDelete &&
          message.loading({ content: 'Đang xóa...', key, duration: 10 })}
        {errorDelete &&
          message.error({ content: `${errorDelete}`, key, duration: 2 })}
        {error && message.error({ content: `${error}`, duration: 2 })}
        {loading ? (
          <Loader />
        ) : (
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={users}
            pagination={true}
            scroll={{ x: 1200, y: 400 }}></Table>
        )}
      </div>
    </>
  )
}

export default UserList
