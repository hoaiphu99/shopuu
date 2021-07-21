import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        placeholder='Search...'
        className='mr-sm-2 ml-sm-5'
        onChange={(e) => setKeyword(e.target.value)}></Form.Control>
      <Button type='submit' className='btn btn-secondary my-2 my-sm-0 m-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
