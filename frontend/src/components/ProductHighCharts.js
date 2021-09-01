import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

const ProductHighCharts = ({ chartOptions }) => {
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default ProductHighCharts
