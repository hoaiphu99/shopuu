import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './views/Home'
import Product from './views/Product'
import Cart from './views/Cart'
import Login from './views/Login'
import Register from './views/Register'
import Profile from './views/Profile'
import Shipping from './views/Shipping'
import Payment from './views/Payment'
import PlaceOrder from './views/PlaceOrder'
import Order from './views/Order'
import UserList from './views/admin/UserList'
import UserEdit from './views/admin/UserEdit'
import ProductList from './views/admin/ProductList'
import ProductCreate from './views/admin/ProductCreate'
import ProductEdit from './views/admin/ProductEdit'
import OrderList from './views/admin/OrderList'

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/order/:id' component={Order} />
          <Route path='/shipping' component={Shipping} />
          <Route path='/payment' component={Payment} />
          <Route path='/placeorder' component={PlaceOrder} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/profile' component={Profile} />
          <Route path='/product/:id' component={Product} />
          <Route path='/cart/:id?' component={Cart} />
          <Route path='/admin/users' component={UserList} />
          <Route path='/admin/user/:id/edit' component={UserEdit} />
          <Route path='/admin/products' component={ProductList} />
          <Route path='/admin/product/create' component={ProductCreate} />
          <Route path='/admin/product/:id/edit' component={ProductEdit} />
          <Route path='/admin/orders' component={OrderList} />
          <Route path='/' component={Home} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
