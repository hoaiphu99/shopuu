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
import {
  getTotalOrders,
  getTotalOrdersWait,
  getTotalUser,
} from '../../actions/statisticActions'

const Dashboard = ({ history }) => {
  const { Option } = Select

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productTopBuy = useSelector((state) => state.productTopBuy)
  const { loading, dataTopBuy } = productTopBuy

  const productBestSeller = useSelector((state) => state.productBestSeller)
  const { loading: loadingBestSeller, dataBestSeller } = productBestSeller

  const statisticTotalOrder = useSelector((state) => state.statisticTotalOrder)
  const { totalOrders } = statisticTotalOrder

  const statisticTotalUser = useSelector((state) => state.statisticTotalUser)
  const { totalUsers } = statisticTotalUser

  const statisticTotalOrderWait = useSelector(
    (state) => state.statisticTotalOrderWait
  )
  const { totalOrdersWait } = statisticTotalOrderWait

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
      if (!totalOrdersWait) {
        dispatch(getTotalOrdersWait())
      }
      if (!totalUsers) {
        dispatch(getTotalUser())
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
  }, [
    dispatch,
    dataTopBuy,
    dataBestSeller,
    chart,
    totalOrders,
    totalOrdersWait,
    totalUsers,
  ])

  const handleChange = (value) => {
    setChart(value)
  }

  const LineChartOptions = {
    title: {
      text: 'S??? l?????ng s???n ph???m b??n ra trong 7 ng??y',
    },
    xAxis: {
      categories: [...date],
    },
    yAxis: {
      title: {
        text: 'S??? l?????ng b??n ra',
      },
    },
    series: [{ name: 'S??? l?????ng b??n', data: [...total] }],
  }

  const ColumnChartOption = {
    chart: {
      type: 'column',
    },
    title: {
      text: '10 s???n ph???m b??n ch???y nh???t',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'T???ng s??? ???? b??n',
      },
    },
    legend: {
      enabled: false,
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> ???? b??n<br/>',
    },

    series: [
      {
        name: 'S???n ph???m',
        colorByPoint: true,
        data: dataToPieChart,
      },
    ],
  }

  return (
    <>
      <DashboardStatistic
        totalOrders={totalOrders}
        totalOrdersWait={totalOrdersWait}
        totalUsers={totalUsers}
      />
      <Typography.Title level={5} style={{ margin: '10px 0' }}>
        Th???ng k??
      </Typography.Title>
      <Select defaultValue='1' style={{ width: 300 }} onChange={handleChange}>
        <Option value='1'>S??? l?????ng SP b??n ra trong 7 ng??y</Option>
        <Option value='2'>Top 10 SP b??n ch???y nh???t</Option>
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
