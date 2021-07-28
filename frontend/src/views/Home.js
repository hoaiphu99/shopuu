import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import { Layout, Row, Col, Divider } from 'antd'

const Home = ({ match, history }) => {
  const { Content } = Layout

  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page: currentPage } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      
        <Layout>
          <Meta />
          <Content style={{ padding: '0 50px' }}>
            <div
              className='site-layout-content'
              style={{ margin: '16px 0', fontSize: '25px' }}>
              Lasted products
            </div>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message message={error} type='error' />
            ) : (
              <>
                <Row>
                  {products.map((product) => (
                    <Col key={product._id} span={4} className='col__card-item'>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Divider />
                  <Col col={16} offset={1}>
                    <Route
                      render={({ history }) => (
                        <Paginate
                          pages={pages}
                          currentPage={currentPage}
                          keyword={keyword ? keyword : ''}
                          history={history}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </>
            )}
          </Content>
        </Layout>
      
      {/* {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )} */}
    </>
  )
}

export default Home
