import React from 'react'
import { Steps } from 'antd'
import {
  UserOutlined,
  SolutionOutlined,
  DollarCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { Step } = Steps
  return (
    <Steps>
      {step1 ? (
        <Step status='finish' title='Đăng nhập' icon={<UserOutlined />} />
      ) : (
        <Step status='wait' title='Đăng nhập' icon={<UserOutlined />} />
      )}
      {step2 ? (
        <Step
          status='finish'
          title='Địa chỉ giao hàng'
          icon={<SolutionOutlined />}
        />
      ) : (
        <Step
          status='wait'
          title='Địa chỉ giao hàng'
          icon={<SolutionOutlined />}
        />
      )}
      {step3 ? (
        <Step
          status='finish'
          title='Phương thức thanh toán'
          icon={<WalletOutlined />}
        />
      ) : (
        <Step
          status='wait'
          title='Phương thức thanh toán'
          icon={<WalletOutlined />}
        />
      )}
      {step4 ? (
        <Step
          status='finish'
          title='Thanh toán'
          icon={<DollarCircleOutlined />}
        />
      ) : (
        <Step
          status='wait'
          title='Thanh toán'
          icon={<DollarCircleOutlined />}
        />
      )}
    </Steps>
  )
}

export default CheckoutSteps
