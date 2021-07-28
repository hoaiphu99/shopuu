import React from 'react'
import { Alert } from 'antd'

const Message = ({ message, type }) => {
  return <Alert message={message} type={type} />
}

Message.defaultProps = { type: 'info' }

export default Message
