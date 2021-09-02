import React, { useState } from 'react'
import { Input } from 'antd'

const SearchBox = ({ history }) => {
  const { Search } = Input

  const onSearch = (value) => {
    if (value.trim()) {
      history.push(`/search/${value}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Search
      placeholder='Nhập từ khóa cần tìm'
      onSearch={onSearch}
      enterButton
    />
  )
}

export default SearchBox
