import React from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, Divider, Typography, Button, Space } from 'antd'
import Rating from './Rating'
import NumberFormat from 'react-number-format'

const Product = ({ product, history }) => {
  const { Text } = Typography
  const addToCartHandler = (id) => {
    history.push(`/cart/${id}?qty=1`)
  }
  return (
    <>
      {product.discount > 0 ? (
        <Badge.Ribbon text={`Giảm ${product.discount}%`} color='volcano'>
          <Card
            className='card-product'
            hoverable
            style={{ width: '100%' }}
            cover={
              <img
                alt={product.images[0].imageName}
                src={product.images[0].imageLink}
              />
            }>
            <Link to={`/${product.category.slug}/${product.slug}`}>
              <h1
                style={{
                  height: '50px',
                  overflow: 'hidden',
                  marginBottom: '3px',
                }}>
                <strong>{product.name}</strong>
              </h1>
              <Space align='baseline'>
                <Typography.Title level={5}>
                  <NumberFormat
                    value={product.price * ((100 - product.discount) / 100)}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <sup>đ</sup>
                </Typography.Title>
                <Text delete>
                  <NumberFormat
                    value={product.price}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <sup>đ</sup>
                </Text>
              </Space>

              <Divider />
              <Rating
                value={product.rating}
                text={`${product.numberReviews} đánh giá`}
              />
            </Link>
            <Button
              type='primary'
              block
              className='btn-add-to-cart'
              onClick={() => addToCartHandler(product._id)}>
              Thêm vào giỏ hàng
            </Button>
          </Card>
        </Badge.Ribbon>
      ) : product.countInStock === 0 ? (
        <Badge.Ribbon text='Hết hàng' color='red'>
          <Card
            className='card-product'
            hoverable
            style={{ width: '100%' }}
            cover={
              <img
                alt={product.images[0].imageName}
                src={product.images[0].imageLink}
              />
            }>
            <Link to={`/${product.category.slug}/${product.slug}`}>
              <h1
                style={{
                  height: '50px',
                  overflow: 'hidden',
                  marginBottom: '3px',
                }}>
                <strong>{product.name}</strong>
              </h1>
              <Typography.Title level={5}>
                <NumberFormat
                  value={product.price}
                  displayType={'text'}
                  thousandSeparator={true}
                />
                <sup>đ</sup>
              </Typography.Title>
              <Divider />
              <Rating
                value={product.rating}
                text={`${product.numberReviews} đánh giá`}
              />
            </Link>
            <Button
              type='primary'
              block
              className='btn-add-to-cart'
              onClick={() => addToCartHandler(product._id)}>
              Thêm vào giỏ hàng
            </Button>
          </Card>
        </Badge.Ribbon>
      ) : (
        <Card
          className='card-product'
          hoverable
          style={{ width: '100%' }}
          cover={
            <img
              alt={product.images[0].imageName}
              src={product.images[0].imageLink}
            />
          }>
          <Link to={`/${product.category.slug}/${product.slug}`}>
            <h1
              style={{
                height: '50px',
                overflow: 'hidden',
                marginBottom: '3px',
              }}>
              <strong>{product.name}</strong>
            </h1>
            <Typography.Title level={5}>
              <NumberFormat
                value={product.price}
                displayType={'text'}
                thousandSeparator={true}
              />
              <sup>đ</sup>
            </Typography.Title>
            <Divider />
            <Rating
              value={product.rating}
              text={`${product.numberReviews} đánh giá`}
            />
          </Link>
          <Button
            type='primary'
            block
            className='btn-add-to-cart'
            onClick={() => addToCartHandler(product._id)}>
            Thêm vào giỏ hàng
          </Button>
        </Card>
      )}
    </>
  )
}

export default Product
