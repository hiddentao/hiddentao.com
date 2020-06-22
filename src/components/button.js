import styled from '@emotion/styled'
import { buttonStyles } from 'emotion-styled-utils'

const Button = styled.button`
  cursor: pointer;
  border-radius: 5px;
  padding: 0.5em 1em;
  font-size: 1rem;

  ${({ theme, disabled: inDisabledState }) => buttonStyles({
    ...theme.button,
    inDisabledState,
  })}
`

export default Button
