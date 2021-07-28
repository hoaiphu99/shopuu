import React from 'react'
import { Route, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Layout, Menu, Row, Col, Button, Dropdown, Typography } from 'antd'
import {
  LoginOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { logout } from '../actions/userActions'
import SearchBox from '../components/SearchBox'

const Header = () => {
  const { Header } = Layout
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/admin'>Admin Dashboard</Link>
      </Menu.Item>
      <Menu.Item>
        <a onClick={logoutHandler}>Logout</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Row justify='space-around' align='middle'>
          <Col span={8}>
            <Link to='/'>
              <div className='logo'>
                <Typography.Title level={3}>Shoppu</Typography.Title>
              </div>
            </Link>
          </Col>
          <Col span={8} className='col-header'>
            <Link to='/cart' className='col-header _item'>
              <ShoppingCartOutlined /> Cart
            </Link>
            {userInfo ? (
              <Dropdown overlay={menu} className='col-header _item'>
                <a
                  className='ant-dropdown-link'
                  onClick={(e) => e.preventDefault()}>
                  {userInfo.name} <DownOutlined />
                </a>
              </Dropdown>
            ) : (
              <Link to='/login' className='col-header _item'>
                <Button icon={<LoginOutlined />}>Sign In</Button>
              </Link>
            )}
            {/* {userInfo && userInfo.isAdmin && (
              <Dropdown overlay={menuAdmin} className='col-header _item'>
                <a
                  className='ant-dropdown-link'
                  onClick={(e) => e.preventDefault()}>
                  {userInfo.name} <DownOutlined />
                </a>
              </Dropdown>
            )} */}
          </Col>
        </Row>
      </Header>
    </Layout>
  )
}

export default Header
