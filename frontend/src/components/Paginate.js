import React from 'react'
//import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'

const Paginate = ({
  pages,
  currentPage,
  isAdmin = false,
  keyword = '',
  history,
}) => {
  const onChange = (page) => {
    !isAdmin
      ? keyword
        ? history.push(`/search/${keyword}/page/${page}`)
        : history.push(`/page/${page}`)
      : history.push(`/admin/products/${page}`)
  }

  return (
    pages > 1 && (
      <Pagination
        current={currentPage}
        onChange={onChange}
        total={pages * 10}
      />
      // <Pagination>
      //   {[...Array(pages).keys()].map((x) => (
      //     <LinkContainer
      //       key={x + 1}
      //       to={
      //         !isAdmin
      //           ? keyword
      //             ? `/search/${keyword}/page/${x + 1}`
      //             : `/page/${x + 1}`
      //           : `/admin/products/${x + 1}`
      //       }>
      //       <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
      //     </LinkContainer>
      //   ))}
      // </Pagination>
    )
  )
}

export default Paginate
