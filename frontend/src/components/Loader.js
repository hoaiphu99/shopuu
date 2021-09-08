import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Loader = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return (
    <div className='spin'>
      <Spin />
    </div>
  )
}

export default Loader
