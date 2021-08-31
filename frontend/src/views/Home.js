import React, { useState, useEffect } from 'react'
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
import { listCategories } from '../actions/categoryActions'
import { listBrands } from '../actions/brandActions'
import { Layout, Row, Col, Divider, Button } from 'antd'
import { SwapLeftOutlined } from '@ant-design/icons'

const Home = ({ match, history, location }) => {
  console.log(location)
  const { Content } = Layout

  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1
  const category = match.params.cateSlug
  let cate = { _id: '', name: '', slug: '' }
  let brand = { _id: '', name: '', slug: '' }

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page: currentPage } = productList

  const categoryList = useSelector((state) => state.categoryList)
  const { loading: loadingCate, categories } = categoryList

  const brandList = useSelector((state) => state.brandList)
  const { loading: loadingBrand, brands } = brandList

  useEffect(() => {
    if (
      !categories ||
      !brands ||
      categories.length === 0 ||
      brands.length === 0
    ) {
      dispatch(listCategories())
      dispatch(listBrands())
    }
    if (category && categories) {
      cate = categories.find((x) => x.slug === category)
    }
    if (cate) dispatch(listProducts(keyword, pageNumber, cate._id))
    else dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, category, keyword, pageNumber])

  return (
    <>
      <Layout>
        <Meta />
        <Content style={{ padding: '0 50px' }}>
          {!keyword && !category ? (
            <ProductCarousel />
          ) : (
            <Link to='/'>
              <Button
                type='primary'
                shape='round'
                icon={
                  <SwapLeftOutlined
                    type='play-circle-o'
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  />
                }>
                Quay lại
              </Button>
            </Link>
          )}
          <div
            className='site-layout-content product-title'
            style={{ margin: '16px 0 0', fontSize: '25px' }}>
            {keyword ? `Kết quả tìm kiếm cho: ${keyword}` : 'Sản phẩm mới nhất'}
          </div>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message message={error} type='error' />
          ) : products.length <= 0 ? (
            <Message message='Không có sản phẩm nào.' />
          ) : (
            <>
              <div className='product-list'>
                <Row gutter={16} align='middle' justify='start'>
                  {products.map((product) => (
                    <Col key={product._id} span={6} className='col__card-item'>
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
              </div>
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
