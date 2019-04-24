import Color from 'color'
import React from "react"
import styled from '@emotion/styled'

import { isYearsOld } from '../utils/date'
import { metaColor } from '../styles/common'
import Alert from './alert'

const Container = styled.div``

const Date = styled.div`
  color: ${Color(metaColor).darken(0.2).hex()};
  font-weight: lighter;
`

const WarningAlert = styled(Alert)`
  margin-top: 0.5rem;
`

const PageLastUpdatedDate = ({ date, showOldDateWarning, className }) => (
  <Container className={className}>
    <Date>{date}</Date>
    {(showOldDateWarning && isYearsOld(date, 2)) ? (
      <WarningAlert>
        Note: This post is over 2 years old and may now be out of date.
        Some of the links not work anymore.
      </WarningAlert>
    ) : null}
  </Container>
)

export default PageLastUpdatedDate
