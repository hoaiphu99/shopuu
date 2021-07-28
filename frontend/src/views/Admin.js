import React, { useState, useEffect } from 'react'
//import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import CategoryList from './admin/CategoryList'
import BrandList from './admin/BrandList'
import UserList from './admin/UserList'
import { formItemLayout, tailFormItemLayout } from '../constants/formConstants'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  message,
  Typography,
  Layout,
  Divider,
  Menu,
  Breadcrumb,
  Descriptions,
} from 'antd'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

const Admin = ({ location, history }) => {
  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm()
  const { Option } = Select

  const { SubMenu } = Menu
  const { Content, Sider } = Layout

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const key = 'update'

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <Container>
      <Layout>
        <Router>
          <Sider width={200} className='site-layout-background'>
            <Menu
              mode='inline'
              defaultSelectedKeys={['adminDashboard']}
              defaultOpenKeys={['admin']}
              style={{ height: '100%', borderRight: 0 }}>
              {userInfo && userInfo.isAdmin && (
                <SubMenu
                  key='admin'
                  icon={<LaptopOutlined />}
                  title='Admin Dashboard'>
                  <Menu.Item key='adminDashboard'>
                    <Link to='/admin'>Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key='users'>
                    <Link to='/admin/users'>Người dùng</Link>
                  </Menu.Item>
                  <Menu.Item key='orders'>
                    <Link to='/admin/orders'>Đơn hàng</Link>
                  </Menu.Item>
                  <Menu.Item key='categories'>
                    <Link to='/admin/categories'>Danh mục</Link>
                  </Menu.Item>
                  <Menu.Item key='brands'>
                    <Link to='/admin/brands'>Thương hiệu</Link>
                  </Menu.Item>
                  <Menu.Item key='products'>
                    <Link to='/admin/products'>Sản phẩm</Link>
                  </Menu.Item>
                </SubMenu>
              )}
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className='site-layout-background'
              style={{
                padding: 24,
                margin: '16px 0',
                minHeight: 280,
              }}>
              <Switch>
                <Route exact path='/admin/users' component={UserList}></Route>
                <Route
                  exact
                  path='/admin/categories'
                  component={CategoryList}></Route>
                <Route exact path='/admin/brands' component={BrandList}></Route>
              </Switch>
            </Content>
          </Layout>
        </Router>
      </Layout>
    </Container>
  )
}

export default Admin