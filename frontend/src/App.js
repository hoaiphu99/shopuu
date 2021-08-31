import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import PageNotFound from './components/404'
import Home from './views/Home'
import Product from './views/Product'
import Cart from './views/Cart'
import Wishlist from './views/Wishlist'
import Login from './views/Login'
import Register from './views/Register'
import Profile from './views/Profile'
import Admin from './views/Admin'
import Shipping from './views/Shipping'
import Payment from './views/Payment'
import PlaceOrder from './views/PlaceOrder'
import Order from './views/Order'
import OrderSuccess from './views/OrderSuccess'
import UserList from './views/admin/UserList'
//import UserEdit from './views/admin/UserEdit'
//import ProductList from './views/admin/ProductList'
//import ProductCreate from './views/admin/ProductCreate'
//import ProductEdit from './views/admin/ProductEdit'
import OrderList from './views/admin/OrderList'
import { BackTop } from 'antd'

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <BackTop />
        <Header />
        <main className='py-3'>
          <Container>
            <Switch>
              <Route path='/shipping' component={Shipping} exact />
              <Route path='/payment' component={Payment} exact />
              <Route path='/placeorder' component={PlaceOrder} exact />
              <Route path='/login' component={Login} exact />
              <Route path='/register' component={Register} exact />
              <Route path='/profile' component={Profile} exact />
              <Route path='/admin' component={Admin} exact />
              <Route path='/admin/users' component={UserList} exact />
              <Route path='/cart/:id?' component={Cart} exact />
              <Route path='/wishlist/:id?' component={Wishlist} exact />
              <Route path='/order/:id' component={Order} exact />
              <Route
                path='/order-success/:orderId'
                component={OrderSuccess}
                exact
              />
              <Route path='/admin/orders' component={OrderList} exact />
              <Route path='/search/:keyword' component={Home} exact />
              <Route path='/page/:pageNumber' component={Home} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                component={Home}
                exact
              />
              <Route path='/:cateSlug?' component={Home} exact />
              <Route path='/:cateSlug/:slug' component={Product} exact />
              <Route path='/' component={Home} exact />
              <Route component={PageNotFound} />
            </Switch>
          </Container>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  )
}

export default App
