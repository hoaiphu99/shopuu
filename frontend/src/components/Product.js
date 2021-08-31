import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Divider, Typography, Button } from 'antd'
import Rating from './Rating'
import NumberFormat from 'react-number-format'

const Product = ({ product, history }) => {
  const addToCartHandler = (id) => {
    history.push(`/cart/${id}?qty=1`)
  }
  return (
    <Card
      className='card-product'
      hoverable
      style={{ width: '100%' }}
      cover={<img alt={product.name} src={product.image} />}>
      <Link to={`/${product.category.slug}/${product.slug}`}>
        <h1>
          <strong>{product.name}</strong>
        </h1>
        <Typography.Title level={5}>
          <NumberFormat
            value={product.price}
            displayType={'text'}
            thousandSeparator={true}
          />{' '}
          VNĐ
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
  )
}

export default Product
