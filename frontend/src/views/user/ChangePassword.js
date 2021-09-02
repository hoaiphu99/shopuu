import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message } from 'antd'
import { changePassword } from '../../actions/userActions'
import { USER_CHANGE_PASSWORD_RESET } from '../../constants/userConstants'
import {
  formItemLayoutDetails,
  tailFormItemLayoutDetails,
} from '../../constants/formConstants'

const ChangePassword = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userChangePassword = useSelector((state) => state.userChangePassword)
  const {
    loading,
    message: messageSuccess,
    error,
    success,
  } = userChangePassword

  const key = 'change'
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (success) {
      message.success({ content: `${messageSuccess}`, key, duration: 2 })
      dispatch({ type: USER_CHANGE_PASSWORD_RESET })
    }
    if (error) dispatch({ type: USER_CHANGE_PASSWORD_RESET })
  }, [success, error])

  const submitHandler = (values) => {
    const data = {
      password: values.password,
      newPassword: values.newPassword,
    }
    dispatch(changePassword(data))
  }
  return (
    <>
      {loading &&
        message.loading({ content: 'Đang thực hiện!', key, duration: 10 })}
      {error && message.error({ content: `${error}`, key, duration: 2 })}
      <Form
        {...formItemLayoutDetails}
        form={form}
        name='register'
        onFinish={submitHandler}
        scrollToFirstError>
        <Form.Item
          name='password'
          label='Mật khẩu hiện tại'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu hiện tại!',
            },
            () => ({
              validator(_, value) {
                if (!value || value.length >= 6) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu từ 6 ký tự trở lên!'))
              },
            }),
          ]}
          hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='newPassword'
          label='Mật khẩu mới'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới!',
            },
            () => ({
              validator(_, value) {
                if (!value || value.length >= 6) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu từ 6 ký tự trở lên!'))
              },
            }),
          ]}
          hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Nhập lại mật khẩu mới'
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu mới!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu mới không khớp!'))
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayoutDetails}>
          <Button type='primary' htmlType='submit'>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ChangePassword
