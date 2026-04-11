import React from "react"

const BOOK_CALL_URL = "https://cal.com/hiddentao/30min"

const BookCallButton = ({
  label = "BOOK_CALL()",
  className = "cyber-btn btn-primary",
  tooltip = "Book a free call",
}) => (
  <a
    href={BOOK_CALL_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    data-tooltip-id="app-tooltip"
    data-tooltip-content={tooltip}
  >
    {label}
  </a>
)

export default BookCallButton
