import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  border: 2px dashed ${({ theme }) => theme.alert.warning.borderColor};
  background-color: ${({ theme }) => theme.alert.warning.bgColor};
  border-radius: 10px;
  font-size: 1.2rem;
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
  <Container className={className}>
    {children}
  </Container>
)

export default Alert
