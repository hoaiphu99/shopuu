import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import ProductHighCharts from '../../components/ProductHighCharts'
import { topBuyProducts } from '../../actions/productActions'

const Dashboard = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productTopBuy = useSelector((state) => state.productTopBuy)
  const { loading, dataTopBuy } = productTopBuy

  const [date, setDate] = useState([])
  const [total, setTotal] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!dataTopBuy || dataTopBuy.length <= 0) {
        dispatch(topBuyProducts())
      } else {
        const dateBuy = dataTopBuy.map((item) => {
          return item.date
        })

        const totalBuy = dataTopBuy.map((item) => {
          return item.total
        })
        setDate(dateBuy.reverse())
        setTotal(totalBuy.reverse())
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, dataTopBuy])

  const chartOptions = {
    title: {
      text: 'Số lượng sản phẩm bán ra trong 7 ngày',
    },
    xAxis: {
      categories: [...date],
    },
    yAxis: {
      title: {
        text: 'Số lượng bán ra',
      },
    },
    series: [{ name: 'Số lượng bán', data: [...total] }],
  }
  return (
    <>
      {loading ? <Loader /> : <ProductHighCharts chartOptions={chartOptions} />}
    </>
  )
}

export default Dashboard
