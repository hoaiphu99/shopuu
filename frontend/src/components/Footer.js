import React from 'react'
import { Row, Col, Divider, Typography } from 'antd'
import { HeartFilled } from '@ant-design/icons'
//import { Container, Row, Col } from 'react-bootstrap'

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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt cilisis.
          </p>
        </Col>
        <Col span={4}>
          <Title level={4} style={{ color: '#fff' }}>
            Shoppu
          </Title>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt cilisis.
          </p>
        </Col>
        <Col span={4}>
          <Title level={4} style={{ color: '#fff' }}>
            Shoppu
          </Title>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt cilisis.
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
          by Shoppu
        </Title>
      </Row>
    </footer>
  )
}

export default Footer
