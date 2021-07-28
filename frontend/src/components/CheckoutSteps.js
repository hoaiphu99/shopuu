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
        <Step status='finish' title='Login' icon={<UserOutlined />} />
      ) : (
        <Step status='wait' title='Login' icon={<UserOutlined />} />
      )}
      {step2 ? (
        <Step
          status='finish'
          title='Shipping Address'
          icon={<SolutionOutlined />}
        />
      ) : (
        <Step
          status='wait'
          title='Shipping Address'
          icon={<SolutionOutlined />}
        />
      )}
      {step3 ? (
        <Step
          status='finish'
          title='Payment Method'
          icon={<WalletOutlined />}
        />
      ) : (
        <Step status='wait' title='Payment Method' icon={<WalletOutlined />} />
      )}
      {step4 ? (
        <Step status='finish' title='Pay' icon={<DollarCircleOutlined />} />
      ) : (
        <Step status='wait' title='Pay' icon={<DollarCircleOutlined />} />
      )}
    </Steps>
  )
}

export default CheckoutSteps
