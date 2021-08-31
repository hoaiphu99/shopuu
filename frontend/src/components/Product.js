import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Divider, Typography } from 'antd'
import Rating from './Rating'
import NumberFormat from 'react-number-format'

const Product = ({ product }) => {
  return (
    <Link to={`/${product.category.slug}/${product.slug}`}>
      <Card
        hoverable
        style={{ width: '100%' }}
        cover={<img alt={product.name} src={product.image} />}>
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
      </Card>
    </Link>
  )
}

export default Product
