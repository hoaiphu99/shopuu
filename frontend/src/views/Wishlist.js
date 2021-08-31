import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import Message from '../components/Message'
import {
  getMyWishlist,
  removeFromWishlist,
  removeAllFromWishList,
} from '../actions/wishlistActions'
import { Row, Col, Typography, Divider, Image, Button, Tag } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

const WishList = ({ match, location, history }) => {
  const productId = match.params.id

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const wishlist = useSelector((state) => state.wishlist)
  const { wishlistItems } = wishlist

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyWishlist())
    }
  }, [dispatch])

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id))
  }

  const removeAllItemsHandler = () => {
    dispatch(removeAllFromWishList())
  }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Divider orientation='left'>Sản phẩm yêu thích</Divider>
        {wishlistItems && wishlistItems.length === 0 ? (
          <Message message={`Không có sản phẩm yêu thích`} />
        ) : (
          <>
            <Row gutter={16} justify='center' align='top'>
              {wishlistItems &&
                wishlistItems.map(({ product }) => (
                  <>
                    <Col span={5}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                      />
                    </Col>
                    <Col span={8}>
                      <Typography.Text>
                        <Link to={`/product/${product.slug}`}>
                          {' '}
                          {product.name}
                        </Link>
                      </Typography.Text>
                    </Col>
                    <Col span={4}>
                      <Typography.Title level={5}>Giá</Typography.Title>
                      <Typography.Text>
                        <NumberFormat
                          value={product.price}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                        <sup>đ</sup>
                      </Typography.Text>
                    </Col>
                    <Col span={3}>
                      <Typography.Title level={5}>Trạng thái</Typography.Title>
                      <Typography.Text>
                        {product.countInStock === 0 ? (
                          <Tag color='red'>Hết hàng</Tag>
                        ) : (
                          <Tag color='green'>Còn hàng</Tag>
                        )}
                      </Typography.Text>
                    </Col>
                    <Col span={2}>
                      <Button
                        type='danger'
                        shape='circle'
                        size='small'
                        icon={
                          <CloseOutlined
                            type='play-circle-o'
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'text-top',
                            }}
                          />
                        }
                        onClick={() => removeFromWishlistHandler(product._id)}
                      />
                    </Col>
                    <Divider />
                  </>
                ))}
            </Row>
          </>
        )}
        <Button
          type='primary'
          shape='round'
          size='large'
          onClick={removeAllItemsHandler}
          style={{ marginTop: '5px' }}>
          Xóa tất cả
        </Button>
      </Col>
      {/* <Col span={8}>
        <Divider orientation='left'>Thanh toán</Divider>
        <Card
          headStyle={{ fontSize: '25px' }}
          title={`Tổng cộng (${cartItems.reduce(
            (acc, item) => acc + item.qty,
            0
          )}) sản phẩm`}>
          <Typography.Title level={4}>
            <NumberFormat
              value={cartItems.reduce(
                (acc, item) => acc + item.qty * item.price,
                0
              )}
              displayType={'text'}
              thousandSeparator={true}
            />{' '}
            VNĐ
          </Typography.Title>
          <Divider />
          <Button
            type='primary'
            shape='round'
            size='large'
            block
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}>
            Tiến hành thanh toán
          </Button>
        </Card>
      </Col> */}
    </Row>
  )
}

export default WishList
