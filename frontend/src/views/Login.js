import React, {  useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import { getMyWishlist } from '../actions/wishlistActions'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Typography,
} from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'

const Login = ({ location, history }) => {
  const { Title } = Typography

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : ''
  const qty = location.search ? location.search.split('=')[2] : 1
  console.log(qty)
  const key = 'login'

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyWishlist())
      message.success({ content: 'Đăng nhập thành công!', key, duration: 2 })
      history.push(`${redirect}=${qty}`)
      // setTimeout(() => {

      // }, 2000)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (values) => {
    console.log(values)
    dispatch(login(values.email, values.password))
  }

  return (
    <>
      <Row justify='center'>
        <Col span={4}>
          <Title>Đăng nhập</Title>
        </Col>
      </Row>
      <Row justify='center'>
        {loading &&
          message.loading({ content: 'Đang đăng nhập...', key, duration: 10 })}
        {error && message.error({ content: `${error}`, key, duration: 2 })}
        <Col span={6}>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{
              remember: true,
            }}
            onFinish={submitHandler}>
            <Form.Item
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Email!',
                },
              ]}>
              <Input
                prefix={<MailOutlined className='site-form-item-icon' />}
                placeholder='Email'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}>
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Mật khẩu'
              />
            </Form.Item>
            <Form.Item>
              {/* <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Nhớ tài khoản</Checkbox>
              </Form.Item> */}

              <Link to='/'>Quên mật khẩu</Link>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'>
                Đăng nhập
              </Button>
              Hoặc{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                đăng ký ngay!
              </Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Login
