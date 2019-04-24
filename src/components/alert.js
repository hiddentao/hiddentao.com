import React from 'react'
import styled from '@emotion/styled'

import { warningAlertBackgroundColor, warningAlertBorderColor } from '../styles/common'

const Container = styled.div`
  border: 2px dashed ${warningAlertBorderColor};
  background-color: ${warningAlertBackgroundColor};
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bolder;
  padding: 0.5rem 1rem;
  text-align: center;
  p {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const Alert = ({ className, children }) => (
  <Container className={className}>{children}</Container>
)

export default Alert
