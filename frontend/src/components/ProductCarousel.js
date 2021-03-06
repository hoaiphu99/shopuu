import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Carousel, Row, Col, Typography } from 'antd'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  // const contentStyle = {
  //   height: '360px',
  //   color: '#fff',
  //   lineHeight: '160px',
  //   textAlign: 'center',
  //   background: '#364d79',
  // }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel autoplay className='carousel' dots={{ style: { color: '#000' } }}>
      {products.map((product) => (
        <div key={product._id}>
          <Link to={`/${product.category.slug}/${product.slug}`}>
            <Row justify='center' align='middle'>
              <Col span={8}>
                <Typography.Title level={3}>{product.name}</Typography.Title>
                <Typography.Title level={4}>
                  <NumberFormat
                    value={product.price}
                    displayType={'text'}
                    thousandSeparator={true}
                  />{' '}
                  VNĐ
                </Typography.Title>
              </Col>
              <Col span={8}>
                <img
                  src={product.images[0].imageLink}
                  alt={product.images[0].imageName}
                />
              </Col>
            </Row>
          </Link>
        </div>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
