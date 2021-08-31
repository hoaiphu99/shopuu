import React, { useState } from 'react'
//import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { Row, Col, Radio, Space, Button, message, Divider } from 'antd'

const Payment = ({ history }) => {
  // const cart = useSelector((state) => state.cart)
  // const { shippingAddress } = cart

  const userDetails = useSelector((state) => state.userDetails)
  const {
    user: { shippingAddress },
  } = userDetails

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = () => {
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <>
      <Row>
        <Col span={16} offset={4}>
          <CheckoutSteps step1 step2 step3 />
          <Divider />
        </Col>
      </Row>
      <Space direction='vertical'>
        <Row>
          <Col span={12} offset={10}>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}>
              <Space direction='vertical'>
                <Radio value='COD'>Ship COD</Radio>
                <Radio value='PayPal'>PayPal</Radio>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={10}>
            <Button type='primary' onClick={submitHandler}>
              Continue
            </Button>
          </Col>
        </Row>
      </Space>
    </>
    // <FormContainer>
    //   <CheckoutSteps step1 step2 step3></CheckoutSteps>
    //   <h1>Payment Method</h1>
    //   <Form onSubmit={submitHandler}>
    //     <Form.Group>
    //       <Form.Label as='legend'>Select Method</Form.Label>
    //       <Col>
    //         <Form.Check
    //           type='radio'
    //           label='PayPal or Credit Card'
    //           id='PayPal'
    //           name='paymentMethod'
    //           value='PayPal'
    //           checked
    //           onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>

    //         {/* <Form.Check
    //           type='radio'
    //           label='Stripe'
    //           id='Stripe'
    //           name='paymentMethod'
    //           value='Stripe'
    //           onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check> */}
    //       </Col>
    //     </Form.Group>

    //     <Button type='submit' className='btn btn-success mt-2'>
    //       Continue
    //     </Button>
    //   </Form>
    // </FormContainer>
  )
}

export default Payment
