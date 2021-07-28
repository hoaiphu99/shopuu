import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
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

  const key = 'login'

  useEffect(() => {
    if (userInfo) {
      message.success({ content: 'Login success!', key, duration: 2 })
      history.push(redirect)
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
        <Col span={3}>
          <Title>Login</Title>
        </Col>
      </Row>
      <Row justify='center'>
        {loading && message.loading({ content: 'Login...', key, duration: 10 })}
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
                  message: 'Please input your Email!',
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
                  message: 'Please input your Password!',
                },
              ]}>
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link className='login-form-forgot' to='/'>
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'>
                Log in
              </Button>
              Or{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                register now!
              </Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Login
