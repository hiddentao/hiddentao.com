import Color from 'color'
import React from "react"
import styled from '@emotion/styled'

import { isMonthsOld } from '../utils/date'
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
    {(showOldDateWarning && isMonthsOld(date, 6)) ? (
      <WarningAlert>
        Note: This post is over 6 months old and may now be out of date.
      </WarningAlert>
    ) : null}
  </Container>
)

export default PageLastUpdatedDate
