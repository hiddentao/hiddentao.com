import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  width: 100%;
  max-width: ${({ width = '1024px' }) => width || '100%'};
  margin: 0 auto;
`

const MaxContentWidth = ({ className, children, width }) => (
  <Container width={width} className={className}>
    {children}
  </Container>
)

export default MaxContentWidth