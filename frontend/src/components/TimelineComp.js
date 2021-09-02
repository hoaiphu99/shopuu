import React from 'react'
import { Timeline } from 'antd'
import Moment from 'react-moment'

const TimelineComp = ({
  created,
  paid,
  delivered,
  status: { statusName, date },
}) => {
  return (
    <Timeline mode='left'>
      {created && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{created}</Moment>}>
          Đã tạo đơn hàng
        </Timeline.Item>
      )}
      {statusName === 'ACCEPT' && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Đã xác nhận
        </Timeline.Item>
      )}
      {statusName === 'CANCEL' && (
        <Timeline.Item
          color='red'
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Bị hủy
        </Timeline.Item>
      )}
      {paid && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{paid}</Moment>}>
          Đã thanh toán
        </Timeline.Item>
      )}
      {delivered && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{delivered}</Moment>}>
          Đã giao hàng
        </Timeline.Item>
      )}
      {statusName === 'FINISH' && (
        <Timeline.Item
          color='green'
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Đã hoàn thành
        </Timeline.Item>
      )}
    </Timeline>
  )
}

export default TimelineComp
