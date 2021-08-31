import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  listProductsByCategory,
  detailsProduct,
  createProductReview,
} from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'
import { addToWishlist, removeFromWishlist } from '../actions/wishlistActions'
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
  HeartTwoTone,
  HeartFilled,
} from '@ant-design/icons'

const Product = ({ history, match }) => {
  const { Title, Text } = Typography
  const { Panel } = Collapse
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  let cate = { _id: '', name: '', slug: '' }

  const productSlug = match.params.slug
  const cateSlug = match.params.cateSlug

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productByCategory = useSelector((state) => state.productByCategory)
  const {
    loading: loadingProductByCategory,
    error: errorProductByCategory,
    products: products,
  } = productByCategory

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const wishlist = useSelector((state) => state.wishlist)
  const { wishlistItems } = wishlist

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
    dispatch(listProductsByCategory(cateSlug))
    dispatch(detailsProduct(productSlug))
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${product._id}?qty=${qty}`)
  }

  const addToWishListHandler = (id) => {
    dispatch(addToWishlist(id))
  }

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id))
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
        <Button
          onClick={history.goBack}
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
      <Divider />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message message={error} type='error' />
      ) : (
        product && (
          <>
            <Row gutter={16}>
              <Col className='gutter-row' span={16}>
                <Row>
                  <Col className='gutter-row' span={12}>
                    <Image src={product.image} alt={product.name} fluid></Image>
                  </Col>
                  <Col className='gutter-row' span={12}>
                    <Card
                      title={product.name}
                      bordered={false}
                      headStyle={{ fontSize: '20px' }}>
                      <Rating
                        value={product.rating}
                        text={`${product.numberReviews} đánh giá`}
                      />
                      <Divider />
                      <Title level={4}>
                        Giá:{' '}
                        <NumberFormat
                          value={product.price}
                          displayType={'text'}
                          thousandSeparator={true}
                        />{' '}
                        VNĐ
                      </Title>
                      <Divider />
                      <Space direction='vertical'>
                        <Text>
                          {product.countInStock > 0 ? (
                            <Alert banner message='Còn hàng' type='success' />
                          ) : (
                            <Alert banner message='Hết hàng' type='error' />
                          )}
                        </Text>
                        <Text>
                          <Space>
                            <strong>Số lượng:</strong>
                            <InputNumber
                              onChange={(value) => setQty(value)}
                              min={product.countInStock === 0 ? 0 : 1}
                              max={product.countInStock}
                              defaultValue={product.countInStock === 0 ? 0 : 1}
                            />
                          </Space>
                        </Text>

                        <Row>
                          <Space>
                            <Button
                              onClick={addToCartHandler}
                              type='primary'
                              disabled={product.countInStock === 0}
                              shape='round'
                              size='large'
                              icon={
                                <ShoppingCartOutlined
                                  type='play-circle-o'
                                  style={{
                                    display: 'inline-block',
                                    verticalAlign: 'text-top',
                                  }}
                                />
                              }>
                              Thêm vào giỏ hàng
                            </Button>
                            {wishlistItems &&
                            wishlistItems.find(
                              (item) => product._id === item.product._id
                            ) ? (
                              <HeartFilled
                                type='play-circle-o'
                                style={{
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  fontSize: '30px',
                                  cursor: 'pointer',
                                  color: '#eb2f96',
                                }}
                                onClick={() =>
                                  removeFromWishlistHandler(product._id)
                                }
                              />
                            ) : (
                              <HeartTwoTone
                                twoToneColor='#eb2f96'
                                type='play-circle-o'
                                style={{
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  fontSize: '30px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  addToWishListHandler(product._id)
                                }}
                              />
                            )}
                          </Space>
                        </Row>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Collapse
                      bordered={false}
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined
                          type='play-circle-o'
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                          rotate={isActive ? 90 : 0}
                        />
                      )}
                      className='site-collapse-custom-collapse'>
                      <Panel
                        header='MÔ TẢ'
                        key='1'
                        className='site-collapse-custom-panel'>
                        <p>{product.description}</p>
                      </Panel>
                    </Collapse>
                  </Col>
                  <Col span={24}>
                    <Divider orientation='left'>Đánh giá</Divider>
                    {loadingProductReview && <Loader />}
                    {errorProductReview &&
                      message.error({
                        content: `${errorProductReview}`,
                        duration: 2,
                      })}

                    {product.reviews.length === 0 && (
                      <Message message='Không có đánh giá nào' type='info' />
                    )}
                    {product.reviews.map((review) => (
                      <>
                        <Comment
                          key={review._id}
                          author={<strong>{review.name}</strong>}
                          content={<p>{review.comment}</p>}
                          datetime={
                            <span>{review.createdAt.substring(0, 10)}</span>
                          }
                        />
                        <Rating value={review.rating} />
                      </>
                    ))}
                  </Col>
                </Row>
              </Col>
              <Col className='gutter-row' span={8}>
                <Divider>Các sản phẩm liên quan</Divider>
                {loadingProductByCategory && <Loader />}
                {products && (
                  <Space direction='vertical' align='end'>
                    {products
                      .filter((i) => i._id !== product._id)
                      .map((i) => (
                        <Link to={`/${i.category.slug}/${i.slug}`}>
                          <Card
                            hoverable
                            style={{ width: '50%', left: '25%' }}
                            cover={<img alt={i.name} src={i.image} />}>
                            <h1>
                              <strong>{i.name}</strong>
                            </h1>
                            <Typography.Title level={5}>
                              <NumberFormat
                                value={i.price}
                                displayType={'text'}
                                thousandSeparator={true}
                              />{' '}
                              VNĐ
                            </Typography.Title>
                          </Card>
                        </Link>
                      ))}
                  </Space>
                )}
              </Col>
            </Row>
          </>
        )
      )}
    </>
  )
}

export default Product
