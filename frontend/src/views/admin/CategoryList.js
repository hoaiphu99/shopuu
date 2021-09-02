import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment'
import {
  message,
  Table,
  Space,
  Typography,
  Input,
  Popconfirm,
  Form,
  Button,
} from 'antd'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/BreadcrumbComp'
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../actions/categoryActions'
import {
  CATEGORY_CREATE_RESET,
  CATEGORY_UPDATE_RESET,
  CATEGORY_DELETE_RESET,
} from '../../constants/categoryConstants'

const CategoryList = ({ history }) => {
  // const { Paragraph } = Typography
  // const { Column } = Table

  const [isAdd, setIsAdd] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const categoryList = useSelector((state) => state.categoryList)
  const { loading, error, categories } = categoryList

  const categoryCreate = useSelector((state) => state.categoryCreate)
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
  } = categoryCreate

  const categoryUpdate = useSelector((state) => state.categoryUpdate)
  const {
    loading: loadingUpdate,
    success,
    error: errorUpdate,
    category,
  } = categoryUpdate

  const categoryDelete = useSelector((state) => state.categoryDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = categoryDelete

  const key = 'msg'

  const [form] = Form.useForm()
  // const [data, setData] = useState(categories)
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record) => record._id === editingKey

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!categories || categories.length <= 0) {
        dispatch(listCategories())
      }
      if (successCreate) {
        message.success({ content: 'Created!', key, duration: 2 })
        dispatch({ type: CATEGORY_CREATE_RESET })
        dispatch(listCategories())
      } else if (success) {
        message.success({ content: 'Saved!', key, duration: 2 })
        dispatch({ type: CATEGORY_UPDATE_RESET })
        dispatch(listCategories())
      } else if (successDelete) {
        message.success({ content: 'Deleted!', key, duration: 2 })
        dispatch({ type: CATEGORY_DELETE_RESET })
        dispatch(listCategories())
      }
    } else {
      history.push('/login')
    }
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    success,
    successDelete,
    isAdd,
    categories,
  ])

  const edit = (record) => {
    //console.log(record)
    form.setFieldsValue({
      name: '',
      description: '',
      ...record,
    })
    setEditingKey(record._id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const handleCreate = (values) => {
    dispatch(createCategory(values))
    setIsAdd(!isAdd)
  }
  const handleDelete = (id) => {
    dispatch(deleteCategory(id))
  }

  const save = async (id) => {
    try {
      const row = await form.validateFields()
      // const newData = [...data]
      // const index = newData.findIndex((item) => id === item._id)
      // console.log(row)
      // if (index > -1) {
      //   const item = newData[index]
      //   newData.splice(index, 1, { ...item, ...row })
      //   setData(newData)
      //   setEditingKey('')
      // } else {
      //   newData.push(row)
      //   setData(newData)
      //   setEditingKey('')
      // }
      setEditingKey('')
      dispatch(updateCategory(id, row))
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: '25%',
      editable: false,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '40%',
      editable: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: '15%',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}>
              Lưu
            </a>
            <Popconfirm title='Chắc chắn hủy?' onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size='middle'>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}>
              Sửa
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
  const mergedColumns = columns.map((col) => {
    //console.log(col)
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'description' ? 'description' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <>
      <div>
        <Breadcrumb link1='Admin' link2='Danh mục' />
        <Button
          type='primary'
          onClick={() => setIsAdd(!isAdd)}
          style={{
            marginBottom: 16,
          }}>
          {!isAdd ? 'Thêm mới' : 'Hủy'}
        </Button>
        {loadingCreate &&
          message.loading({ content: 'Creating...', key, duration: 10 })}
        {errorCreate &&
          message.error({ content: `${errorCreate}`, key, duration: 2 })}
        {loadingUpdate &&
          message.loading({ content: 'Saving...', key, duration: 10 })}
        {errorUpdate &&
          message.error({ content: `${errorUpdate}`, key, duration: 2 })}
        {loadingDelete &&
          message.loading({ content: 'Deleting...', key, duration: 10 })}
        {errorDelete &&
          message.error({ content: `${errorDelete}`, key, duration: 2 })}
        {error && message.error({ content: `${error}`, duration: 2 })}
        {loading ? (
          <Loader />
        ) : !isAdd ? (
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowKey={(record) => record._id}
              bordered
              dataSource={categories}
              columns={mergedColumns}
              rowClassName='editable-row'
              pagination={false}
              scroll={{ x: '', y: 400 }}
              // pagination={{
              //   onChange: cancel,
              // }}
            />
          </Form>
        ) : (
          <>
            <Form
              name='basic'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleCreate}>
              <Form.Item
                label='Tên'
                name='name'
                rules={[{ required: true, message: 'Vui lòng nhậ tên!' }]}>
                <Input />
              </Form.Item>

              <Form.Item label='Mô tả' name='description'>
                <Input.TextArea row={3} showCount maxLength={100} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type='primary' htmlType='submit'>
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </>
  )
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'description' ? (
      <Input.TextArea rows={3} showCount maxLength={100} />
    ) : (
      <Input />
    )
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default CategoryList
