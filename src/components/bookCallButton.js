import React from "react"
import LogRocket from "logrocket"

const BOOK_CALL_URL = "https://cal.com/hiddentao/30min"

const BookCallButton = ({
  label = "./book_call.sh",
  className = "cyber-btn cyber-btn-primary",
  tooltip = "Book a free call",
}) => (
  <a
    href={BOOK_CALL_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    data-tooltip-id="app-tooltip"
    data-tooltip-content={tooltip}
    onClick={() => LogRocket.track("Book Call Clicked")}
  >
    {label}
  </a>
)

export default BookCallButton
