import React from "react"
import styled from '@emotion/styled'
import { boxShadow } from 'emotion-styled-utils'

const AvatarImg = styled.img`
  width: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  min-height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size}px;
  ${({ theme }) => boxShadow({ color: theme.ramImage.shadowColor })};
`

const RamImage = ({ className, size }) => (
  <AvatarImg
    className={className}
    size={size}
    src={`https://en.gravatar.com/userimage/8741423/cc61f1f47e6f0f00b509b644ed1355dc.jpg?size=${size}`} alt="Ram"
  />
)

export default RamImage
