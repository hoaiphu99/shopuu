import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Dashboard from './admin/Dashboard'
import CategoryList from './admin/CategoryList'
import BrandList from './admin/BrandList'
import UserList from './admin/UserList'
import SupplierList from './admin/SupplierList'
import ProductList from './admin/ProductList'
import OrderList from './admin/OrderList'
import ProductCreate from './admin/ProductCreate'
import ProductEdit from './admin/ProductEdit'
import UserCreate from './admin/UserCreate'
import UserEdit from './admin/UserEdit'
import SupplierEdit from './admin/SupplierEdit'
import OrderSupplierCreate from './admin/OrderSupplierCreate'
import OrderSupplierList from './admin/OrderSupplierList'
import OrderSupplierDetails from './admin/OrderSupplierDetails'
import ImportList from './admin/ImportList'
import ImportDetails from './admin/ImportDetails'
import ImportCreate from './admin/ImportCreate'
import DiscountCreate from './admin/DiscountCreate'
import Order from './Order'
import { Form, Select, Layout, Menu } from 'antd'
import { LaptopOutlined, BankOutlined } from '@ant-design/icons'

const Admin = ({ location, history }) => {
  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm()
  const { Option } = Select

  const { SubMenu } = Menu
  const { Content, Sider } = Layout

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // const key = 'update'

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <>
      <Layout className='admin_layout'>
        {/* <Router> */}
        <Sider width={250} className='site-layout-background'>
          <Menu
            mode='inline'
            defaultSelectedKeys={['adminDashboard']}
            defaultOpenKeys={['admin']}
            style={{ height: '100%', borderRight: 0 }}>
            {userInfo && userInfo.isAdmin && (
              <>
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
                  <Menu.Item key='suppliers'>
                    <Link to='/admin/suppliers'>Nhà cung cấp</Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key='adminFunc'
                  icon={<BankOutlined />}
                  title='Chức năng'>
                  <Menu.Item key='orderSuppliers'>
                    <Link to='/admin/order-suppliers'>Đặt hàng từ NCC</Link>
                  </Menu.Item>
                  <Menu.Item key='imports'>
                    <Link to='/admin/imports'>Nhập hàng</Link>
                  </Menu.Item>
                  <Menu.Item key='addDiscount'>
                    <Link to='/admin/discount'>Giảm giá sản phẩm</Link>
                  </Menu.Item>
                </SubMenu>
              </>
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
              <Route exact path='/admin' component={Dashboard}></Route>
              <Route exact path='/admin/users' component={UserList}></Route>
              <Route
                exact
                path='/admin/users/create'
                component={UserCreate}></Route>
              <Route exact path='/admin/users/:id' component={UserEdit}></Route>
              <Route
                exact
                path='/admin/products'
                component={ProductList}></Route>
              <Route
                exact
                path='/admin/products/create'
                component={ProductCreate}></Route>
              <Route
                exact
                path='/admin/products/:id'
                component={ProductEdit}></Route>
              <Route path='/admin/order/:id' component={Order} />
              <Route exact path='/admin/orders' component={OrderList}></Route>
              <Route
                exact
                path='/admin/categories'
                component={CategoryList}></Route>
              <Route exact path='/admin/brands' component={BrandList}></Route>
              <Route
                exact
                path='/admin/suppliers'
                component={SupplierList}></Route>
              <Route
                exact
                path='/admin/suppliers/:id'
                component={SupplierEdit}></Route>
              <Route
                exact
                path='/admin/order-suppliers'
                component={OrderSupplierList}></Route>
              <Route
                exact
                path='/admin/order-suppliers/create'
                component={OrderSupplierCreate}></Route>
              <Route
                exact
                path='/admin/order-suppliers/:id'
                component={OrderSupplierDetails}></Route>
              <Route exact path='/admin/imports' component={ImportList}></Route>
              <Route
                exact
                path='/admin/imports/:id'
                component={ImportDetails}></Route>
              <Route
                path='/admin/imports/create/:id'
                component={ImportCreate}></Route>
              <Route path='/admin/discount' component={DiscountCreate}></Route>
            </Switch>
          </Content>
        </Layout>
        {/* </Router> */}
      </Layout>
    </>
  )
}

export default Admin
