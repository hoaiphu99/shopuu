import React, { useState } from 'react'
import { Input } from 'antd'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')
  const { Search } = Input

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

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
