import React from "react"
import { isMonthsOld } from '../utils/date'

const PageLastUpdatedDate = ({ date, showOldDateWarning, className }) => (
  <div className={className}>
    <span className="text-[#a3a3a3] font-light">{date}</span>
    {showOldDateWarning && isMonthsOld(date, 24) ? (
      <span className="text-[70%] italic text-[var(--color-crayola)] lowercase before:content-['_-_']">
        This post is over 2 years old and may now be out of date
      </span>
    ) : null}
  </div>
)

export default PageLastUpdatedDate
