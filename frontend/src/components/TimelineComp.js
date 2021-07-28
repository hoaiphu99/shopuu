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
          Created
        </Timeline.Item>
      )}
      {statusName === 'ACCEPT' && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Order Accepted
        </Timeline.Item>
      )}
      {statusName === 'CANCEL' && (
        <Timeline.Item
          color='red'
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Order canceled
        </Timeline.Item>
      )}
      {paid && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{paid}</Moment>}>
          Paid
        </Timeline.Item>
      )}
      {delivered && (
        <Timeline.Item
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{delivered}</Moment>}>
          Delivered
        </Timeline.Item>
      )}
      {statusName === 'FINISH' && (
        <Timeline.Item
          color='green'
          label={<Moment format='DD/MM/YYYY hh:mm:ss'>{date}</Moment>}>
          Order finish
        </Timeline.Item>
      )}
    </Timeline>
  )
}

export default TimelineComp
