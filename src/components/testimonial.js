import trunc from 'lodash.truncate'
import React, { useState, useCallback } from "react"
import styled from '@emotion/styled'

const Container = styled.div`
  font-size: 1.5rem;
  background-color: ${({ theme }) => theme.testimonial.bgColor};
`

const Text = styled.p`
  font-size: 1em;
  line-height: 1.3em;
  ${({ theme }) => theme.font('body', 'thin', 'italic')};
  color: ${({ theme }) => theme.testimonial.quote.textColor};

  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
`

const By = styled.p`
  color: ${({ theme }) => theme.testimonial.attribution.textColor};
  text-align: right;
  margin-top: 0.5em;
  font-size: 0.8em;
`

const Testimonial = ({ className, name, company, text }) => {
  const [ expanded, setExpanded ] = useState()
  const expand = useCallback(e => {
    e.preventDefault()
    setExpanded(true)
  }, [])

  return (
    <Container className={className}>
      <Text>
        {(text.length > 200 && !expanded) ? (
          <span>
            {trunc(text, { length: 200, omission: ' ' })}
            <a title="read more" onClick={expand} href='#'>...</a>
          </span>
        ) : text}
      </Text>
      <By>
      - {name} ({company})
      </By>
    </Container>
  )
}

export default Testimonial
