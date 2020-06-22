import React, { useMemo } from "react"
import styled from '@emotion/styled'
import { boxShadow, childAnchors } from 'emotion-styled-utils'


const Container = styled.div`
  background-color: ${({ theme }) => theme.section.bgColor};
  color: ${({ theme }) => theme.section.textColor};
  border: 1px solid ${({ theme }) => theme.section.borderColor};
  padding: 2rem;
  border-radius: 10px;
  ${({ theme }) => boxShadow({ color: theme.section.shadowColor })};
  ${({ theme }) => childAnchors(theme.section.anchor)};
`

const Section = ({ children, className }) => (
  <Container className={className}>{children}</Container>
)

export default Section