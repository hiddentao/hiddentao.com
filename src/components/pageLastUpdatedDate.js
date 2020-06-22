import React from "react"
import styled from '@emotion/styled'

import { isMonthsOld } from '../utils/date'

const Container = styled.div``

const Date = styled.span`
  color: ${({ theme }) => theme.lastUpdatedDate.textColor};
  font-weight: lighter;
`

const WarningAlert = styled.span`
  font-size: 70%;
  font-style: italic;
  color: ${({ theme }) => theme.lastUpdatedDate.warning.textColor};
  text-transform: lowercase;

  &::before {
    content: ' - ';
  }
`

const PageLastUpdatedDate = ({ date, showOldDateWarning, className }) => (
  <Container className={className}>
    <Date>{date}</Date>
    {(showOldDateWarning && isMonthsOld(date, 24)) ? (
      <WarningAlert>
        This post is over 2 years old and may now be out of date
      </WarningAlert>
    ) : null}
  </Container>
)

export default PageLastUpdatedDate
