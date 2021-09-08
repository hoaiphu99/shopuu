import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Select, Typography } from 'antd'
import Loader from '../../components/Loader'
import ProductHighCharts from '../../components/ProductHighCharts'
import DashboardStatistic from '../../components/DashboardStatistic'
import {
  topBuyProducts,
  bestSellerProducts,
} from '../../actions/productActions'
import { getTotalOrders } from '../../actions/statisticActions'

const Dashboard = ({ history }) => {
  const { Option } = Select

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productTopBuy = useSelector((state) => state.productTopBuy)
  const { loading, dataTopBuy } = productTopBuy

  const productBestSeller = useSelector((state) => state.productBestSeller)
  const { loading: loadingBestSeller, dataBestSeller } = productBestSeller

  const statistic = useSelector((state) => state.statistic)
  const { totalOrders, totalOrdersWait, sales } = statistic

  const [date, setDate] = useState([])
  const [total, setTotal] = useState([])
  const [dataToPieChart, setDataToPieChart] = useState([])

  const [chart, setChart] = useState('1')

  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!totalOrders) {
        dispatch(getTotalOrders())
      }
      if (chart === '1') {
        if (!dataTopBuy) {
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
      }
      if (chart === '2') {
        if (!dataBestSeller) {
          dispatch(bestSellerProducts())
        } else {
          const data = dataBestSeller.map((item) => {
            const { totalSell: y, ...name } = item
            return { y, ...name }
          })
          setDataToPieChart(data)
        }
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, dataTopBuy, dataBestSeller, chart, totalOrders])

  const handleChange = (value) => {
    setChart(value)
  }

  const LineChartOptions = {
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

  const ColumnChartOption = {
    chart: {
      type: 'column',
    },
    title: {
      text: '10 sản phẩm bán chạy nhất',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Tổng số đã bán',
      },
    },
    legend: {
      enabled: false,
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> đã bán<br/>',
    },

    series: [
      {
        name: 'Sản phẩm',
        colorByPoint: true,
        data: dataToPieChart,
      },
    ],
  }

  return (
    <>
      <DashboardStatistic totalOrders={totalOrders} />
      <Typography.Title level={5} style={{ margin: '10px 0' }}>
        Thống kê
      </Typography.Title>
      <Select defaultValue='1' style={{ width: 300 }} onChange={handleChange}>
        <Option value='1'>Số lượng SP bán ra trong 7 ngày</Option>
        <Option value='2'>Top 10 SP bán chạy nhất</Option>
      </Select>
      {chart === '1' ? (
        loading ? (
          <Loader />
        ) : (
          <ProductHighCharts chartOptions={LineChartOptions} />
        )
      ) : (
        ''
      )}
      {chart === '2' ? (
        loadingBestSeller ? (
          <Loader />
        ) : (
          <ProductHighCharts chartOptions={ColumnChartOption} />
        )
      ) : (
        ''
      )}
    </>
  )
}

export default Dashboard
