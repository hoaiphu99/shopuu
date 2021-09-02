import React from 'react'
import { Row, Col, Divider, Typography } from 'antd'
import { HeartFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Footer = () => {
  const { Title } = Typography
  return (
    <footer
      style={{ backgroundColor: '#353535', color: '#fff', paddingTop: '15px' }}>
      <Row justify='space-around'>
        <Col span={4}>
          <Title level={4} style={{ color: '#fff' }}>
            Shoppu
          </Title>
          <p>Shop bán phụ kiện và linh kiện máy tính mới linh tinh.</p>
        </Col>
        <Col span={4}>
          <Title level={4} style={{ color: '#fff' }}>
            THANH TOÁN
          </Title>
          <p>
            <img
              src='/images/paypal.jpg'
              width='50%'
              style={{ margin: '5px' }}
            />
            <img src='/images/cod.jpg' width='50%' style={{ margin: '5px' }} />
          </p>
          <p></p>
        </Col>
        <Col span={4}>
          <Title level={4} style={{ color: '#fff' }}>
            LIÊN KẾT NHANH
          </Title>
          <p>
            <Link to='/'>Trang chủ</Link>
          </p>
          <p>
            <Link to='#'>About</Link>
          </p>
          <p>
            <Link to='#'>Liên hệ</Link>
          </p>
          <p>
            <a href='https://hoaiphu.xyz' target='_blank'>
              Hoaiphu Blog
            </a>
          </p>
        </Col>
        <Col span={6}>
          <Title level={4} style={{ color: '#fff' }}>
            ĐỊA CHỈ
          </Title>
          <p>
            <b>HỒ CHÍ MINH:</b> Số 97 Man Thiện, Phường Hiệp Phú, Quận 9, TP.
            Thủ Đức, TP. Hồ Chí Minh
          </p>
          <br />
          <p>
            Điện thoại: <b>(028) 1234 5678 - DĐ: 0123456789</b>
          </p>
          <br />
          <p>
            <b>Mở cửa:</b> 9h đến 20h từ thứ 2 đến thứ 7, <b>Chủ nhật</b> 10h
            đến 19h.
          </p>
        </Col>
        <Divider style={{ backgroundColor: '#fff' }} />
        <Title level={5} style={{ color: '#fff' }}>
          Copyright &copy; 2021 All rights reserved{' '}
          <HeartFilled
            style={{
              color: 'red',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          />{' '}
          by <Link to='/'>Shoppu</Link>
        </Title>
      </Row>
    </footer>
  )
}

export default Footer
