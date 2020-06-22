import React from "react"
import styled from '@emotion/styled'
import { boxShadow } from 'emotion-styled-utils'

const AvatarImg = styled.img`
  width: ${({ size }) => size};
  min-width: ${({ size }) => size};
  height: ${({ size }) => size};
  min-height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  ${({ theme }) => boxShadow({ color: theme.ramImage.shadowColor })};
`

const RamImage = ({ className, size }) => (
  <AvatarImg
    className={className}
    size={size}
    src="https://en.gravatar.com/userimage/8741423/cc61f1f47e6f0f00b509b644ed1355dc.jpg?size=200" alt="Ram"
  />
)

export default RamImage
