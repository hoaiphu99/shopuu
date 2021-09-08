import React from 'react'
import { Statistic, Card, Row, Col } from 'antd'
import {
  HourglassOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons'

const DashboardStatistic = ({ totalOrders, totalOrdersWait, totalUsers }) => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title='Tổng số đơn hàng'
            value={totalOrders}
            valueStyle={{ color: '#3f8600' }}
            prefix={
              <CalendarOutlined
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
            }
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title='Đơn hàng chờ xác nhận'
            value={totalOrdersWait}
            valueStyle={{ color: '#eb4034' }}
            prefix={
              <HourglassOutlined
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
            }
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title='Khách hàng'
            value={totalUsers}
            valueStyle={{ color: '#3d34eb' }}
            prefix={
              <UserOutlined
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
            }
          />
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardStatistic
