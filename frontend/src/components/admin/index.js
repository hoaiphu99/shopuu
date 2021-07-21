import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const AdminLayout = () => {
  return (
    <Router>
      <main className='py-3'>
        <Container>
          <h1>Hello</h1>
        </Container>
      </main>
    </Router>
  )
}

export default AdminLayout
