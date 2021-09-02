import React from 'react'
import { Route, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Layout,
  Menu,
  Row,
  Col,
  Dropdown,
  Typography,
  Space,
  Badge,
} from 'antd'
import {
  LoginOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { logout } from '../actions/userActions'
import SearchBox from '../components/SearchBox'
import Navbar from '../components/Navbar'

const Header = () => {
  //const { Header } = Layout

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const wishlist = useSelector((state) => state.wishlist)
  const { wishlistItems } = wishlist

  const logoutHandler = () => {
    dispatch(logout())
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to='/profile'>Trang cá nhân</Link>
      </Menu.Item>
      {userInfo && userInfo.isAdmin && (
        <Menu.Item>
          <Link to='/admin'>Admin Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <a href='#' onClick={logoutHandler}>
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <header>
        <Row justify='center' align='middle'>
          <Col span={6}>
            <div className='logo'>
              <Typography.Title level={3}>
                <Link to='/'>Shopuu</Link>
              </Typography.Title>
            </div>
          </Col>
          <Col span={6}>
            <Route render={({ history }) => <SearchBox history={history} />} />
          </Col>
          <Col span={6}>
            <Space size='middle' style={{ justifyContent: 'flex-end' }}>
              <Link to='/wishlist' style={{ fontSize: '15px' }}>
                <Badge
                  size='small'
                  count={wishlistItems && wishlistItems.length}>
                  <HeartOutlined
                    type='play-circle-o'
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      fontSize: '20px',
                    }}
                  />
                </Badge>
                {'   '}
              </Link>
              <Link to='/cart' style={{ fontSize: '15px' }}>
                <Badge size='small' count={cartItems && cartItems.length}>
                  <ShoppingCartOutlined
                    type='play-circle-o'
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      fontSize: '20px',
                    }}
                  />
                </Badge>
                {'   '}
              </Link>
              {userInfo ? (
                <Dropdown overlay={menu}>
                  <a
                    href='#'
                    style={{ fontSize: '15px' }}
                    className='ant-dropdown-link'
                    onClick={(e) => e.preventDefault()}>
                    {userInfo.name}{' '}
                    <DownOutlined
                      type='play-circle-o'
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    />
                  </a>
                </Dropdown>
              ) : (
                <Link to='/login' style={{ fontSize: '15px' }}>
                  <LoginOutlined
                    type='play-circle-o'
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  />{' '}
                  Đăng nhập
                </Link>
              )}
            </Space>
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
      </header>
      <Row justify='center'>
        <Col span={18}>
          <Route
            render={({ location }) => (
              <Navbar location={location} category={true} />
            )}
          />
        </Col>
        {/* <Col span={8}>
          <Route
            render={({ location }) => (
              <Navbar location={location} brand={true} />
            )}
          />
        </Col> */}
      </Row>
    </Layout>
  )
}

export default Header
