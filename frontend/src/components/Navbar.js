import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { listCategories } from '../actions/categoryActions'
import { listBrands } from '../actions/brandActions'

const Navbar = ({ location, category, brand }) => {
  const key = location.pathname ? location.pathname.split('/')[1] : ''

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const brandList = useSelector((state) => state.brandList)
  const { brands } = brandList

  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !categories ||
      !brands ||
      categories.length === 0 ||
      brands.length === 0
    ) {
      dispatch(listCategories())
      dispatch(listBrands())
    }
  }, [dispatch])

  return (
    <navbar className='header'>
      <Menu
        selectedKeys={[key]}
        theme='light'
        mode='horizontal'
        style={{ display: 'flex', justifyContent: 'center' }}>
        {category && (
          <Menu.Item key='home'>
            <Link to='/'>Trang chủ</Link>
          </Menu.Item>
        )}
        {category &&
          categories &&
          categories.map((category) => (
            <Menu.Item key={category.slug}>
              <Link to={`/${category.slug}`}>{category.name}</Link>
            </Menu.Item>
          ))}
        {brand &&
          brands &&
          brands.map((brand) => (
            <Menu.Item key={brand.slug}>
              <Link to={`/${brand.slug}`}>{brand.name}</Link>
            </Menu.Item>
          ))}
      </Menu>
    </navbar>
  )
}

export default Navbar
