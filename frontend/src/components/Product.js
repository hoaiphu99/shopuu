import React from 'react'
import { Link } from 'react-router-dom'
// import { Card } from 'react-bootstrap'
import { Card, Divider } from 'antd'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`}>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={product.name} src={product.image} />}>
        <h1>
          <strong>{product.name}</strong>
        </h1>
        <p>Price: ${product.price}</p>
        <Divider />
        <Rating
          value={product.rating}
          text={`${product.numberReviews} reviews`}
        />
      </Card>
    </Link>
    // <Card className='my-3 p-3 rounded'>
    //   <Link to={`/product/${product._id}`}>
    //     <Card.Img src={product.image} variant='top' />
    //   </Link>

    //   <Card.Body>
    //     <Link to={`/product/${product._id}`}>
    //       <Card.Title as='div'>
    //         <strong>{product.name}</strong>
    //       </Card.Title>
    //     </Link>

    //     <Card.Text as='div'>
    //       <Rating
    //         value={product.rating}
    //         text={`${product.numberReviews} reviews`}
    //       />
    //     </Card.Text>

    //     <Card.Text as='h3'>${product.price}</Card.Text>
    //   </Card.Body>
    // </Card>
  )
}

export default Product
