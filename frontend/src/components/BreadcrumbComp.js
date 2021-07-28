import React from 'react'
import { Breadcrumb } from 'antd'

const BreadcrumbComp = ({ link1, link2, link3 }) => {
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      {link1 && <Breadcrumb.Item>{link1}</Breadcrumb.Item>}
      {link2 && <Breadcrumb.Item>{link2}</Breadcrumb.Item>}
      {link3 && <Breadcrumb.Item>{link3}</Breadcrumb.Item>}
    </Breadcrumb>
  )
}

export default BreadcrumbComp
