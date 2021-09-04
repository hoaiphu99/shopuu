import React from 'react'
import { Statistic, Card, Row, Col } from 'antd'
import { HourglassOutlined, DollarOutlined } from '@ant-design/icons'

const DashboardStatistic = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic
            title='Đơn hàng chờ xác nhận'
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
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
      <Col span={12}>
        <Card>
          <Statistic
            title='Doanh thu'
            value={9.3}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={
              <DollarOutlined
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
