import styled from '@emotion/styled'

import { anchorColor } from '../styles/common'

const Button = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: 1px solid ${anchorColor};
  border-radius: 5px;
  padding: 0.5em 1em;
  font-size: 1rem;
  color: ${anchorColor};
  &:hover {
    background-color: ${anchorColor};
    color: #fff;
  },
  &:active {
    outline: none;
  }
`

export default Button
