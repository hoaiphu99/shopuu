import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
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
import UserList from './views/admin/UserList'
import UserEdit from './views/admin/UserEdit'
import ProductList from './views/admin/ProductList'
import ProductCreate from './views/admin/ProductCreate'
import ProductEdit from './views/admin/ProductEdit'
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
              <Route path='/shipping' component={Shipping} />
              <Route path='/payment' component={Payment} />
              <Route path='/placeorder' component={PlaceOrder} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/profile' component={Profile} />
              <Route path='/admin' component={Admin} />
              <Route path='/admin/users' component={UserList} />
              <Route path='/cart/:id?' component={Cart} />
              <Route path='/wishlist/:id?' component={Wishlist} />
              <Route path='/order/:id' component={Order} />
              <Route path='/admin/orders' component={OrderList} />
              <Route path='/search/:keyword' component={Home} exact />
              <Route path='/page/:pageNumber' component={Home} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                component={Home}
                exact
              />
              <Route path='/:cateSlug?' component={Home} exact />
              <Route path='/:cateSlug/:slug' component={Product} />
              <Route path='/' component={Home} exact />
            </Switch>
          </Container>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  )
}

export default App
