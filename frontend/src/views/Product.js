import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { detailsProduct, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import {
  message,
  Row,
  Col,
  Button,
  Space,
  Divider,
  Card,
  Typography,
  InputNumber,
  Alert,
  Collapse,
  Comment,
  Form,
  Input,
  Rate,
} from 'antd'
import {
  SwapLeftOutlined,
  ShoppingCartOutlined,
  CaretRightOutlined,
} from '@ant-design/icons'

const Product = ({ history, match }) => {
  const { Title, Text } = Typography
  const { Panel } = Collapse
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']

  const productSlug = match.params.slug

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(detailsProduct(productSlug))
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${product._id}?qty=${qty}`)
  }

  const submitHandler = (values) => {
    const data = {
      rating,
      comment: values.comment,
    }
    dispatch(createProductReview(product._id, data))
  }

  return (
    <>
      <Link to='/'>
        <Button type='primary' shape='round' icon={<SwapLeftOutlined />}>
          Go back
        </Button>
      </Link>
      <Divider />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message message={error} type='error' />
      ) : (
        <>
          <Row gutter={16}>
            <Col className='gutter-row' span={8}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col className='gutter-row' span={8}>
              <Card
                title={product.name}
                bordered={false}
                headStyle={{ fontSize: '20px' }}>
                <Rating
                  value={product.rating}
                  text={`${product.numberReviews} reviews`}
                />
                <Divider />
                <Title level={4}>Price: ${product.price}</Title>
                <Divider />
                <Space direction='vertical'>
                  <Text>
                    {product.countInStock > 0 ? (
                      <Alert banner message='In Stock' type='success' />
                    ) : (
                      <Alert banner message='Out of Stock' type='error' />
                    )}
                  </Text>
                  <Text>
                    <Space>
                      <strong>Quantity:</strong>
                      <InputNumber
                        onChange={(value) => setQty(value)}
                        min={1}
                        max={product.countInStock}
                        defaultValue={1}
                      />
                    </Space>
                  </Text>

                  <Button
                    onClick={addToCartHandler}
                    type='primary'
                    block
                    shape='round'
                    size='large'
                    icon={<ShoppingCartOutlined />}>
                    ADD TO CART
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col className='gutter-row' span={8}>
              <Divider>Related Products</Divider>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                className='site-collapse-custom-collapse'>
                <Panel
                  header='DESCRIPTION'
                  key='1'
                  className='site-collapse-custom-panel'>
                  <p>{product.description}</p>
                </Panel>
              </Collapse>
            </Col>
            <Col span={16}>
              <Divider orientation='left'>Reviews</Divider>
              {loadingProductReview && <Loader />}
              {errorProductReview &&
                message.error({
                  content: `${errorProductReview}`,
                  duration: 2,
                })}
              {userInfo ? (
                <>
                  <span>
                    <Rate
                      tooltips={desc}
                      onChange={(value) => setRating(value)}
                      value={rating}
                    />
                    {rating ? (
                      <span className='ant-rate-text'>{desc[rating - 1]}</span>
                    ) : (
                      ''
                    )}
                  </span>
                  <Form
                    name='basic'
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={submitHandler}>
                    <Form.Item
                      label='Comment'
                      name='comment'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your review!',
                        },
                      ]}>
                      <Input.TextArea />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                      <Button type='primary' htmlType='submit'>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>{' '}
                </>
              ) : (
                <Message message='Please login to reviews' type='error' />
              )}
              {product.reviews.length === 0 && (
                <Message message='No reviews' type='info' />
              )}
              {product.reviews.map((review) => (
                <Comment
                  key={review._id}
                  author={<strong>{review.name}</strong>}
                  content={<p>{review.comment}</p>}
                  datetime={<span>{review.createdAt.substring(0, 10)}</span>}
                />
              ))}
            </Col>
          </Row>
          {/* <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numberReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: ${product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}>
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row>
                      <Button
                        onClick={addToCartHandler}
                        className='btn btn-dark btn btn-lg'
                        type='button'
                        disabled={product.countInStock === 0}>
                        Add To Cart
                      </Button>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && (
                <Message variant='primary'>No reviews</Message>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Place a review</h2>
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}>
                          <option value=''>---Select---</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good-</option>
                          <option value='4'>4 - Very good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='btn btn-dark'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row> */}
        </>
      )}
    </>
  )
}

export default Product
