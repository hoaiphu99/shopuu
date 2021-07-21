import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { createProduct } from '../../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants'

const ProductCreate = ({ history }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productCreate = useSelector((state) => state.productCreate)
  const { loading, error, success } = productCreate

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      history.push('/admin/products')
    }
  }, [dispatch, success])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    )
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  return (
    <>
      <Link to='/admin/products' className='btn btn-light my-3'>
        Go back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label className='mt-4'>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='0'
              value={price}
              onChange={(e) => setPrice(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label className='mt-4'>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Image url'
              value={image}
              onChange={(e) => setImage(e.target.value)}></Form.Control>
            <Form.File
              id='image-file'
              label='Choose File'
              custom
              onChange={uploadFileHandler}></Form.File>
            {uploading && <Loader />}
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label className='mt-4'>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='countInStock'>
            <Form.Label className='mt-4'>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter Count In Stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label className='mt-4'>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label className='mt-4'>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            className='btn btn-success mt-2'>
            Create
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default ProductCreate
