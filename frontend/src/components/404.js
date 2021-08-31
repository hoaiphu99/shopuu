import React from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

const PageNotFound = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Xin lỗi, trang này không tồn tại.'
      extra={
        <Link to='/'>
          <Button type='primary'>Trang chủ</Button>
        </Link>
      }
    />
  )
}

export default PageNotFound
