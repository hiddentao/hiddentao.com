import React from "react"
import { Link } from "gatsby"

const CyberLink = ({ to, href, tooltip, className, children, onClick }) => {
  const cls = className || "cyber-btn cyber-btn-sm"
  const tooltipProps = tooltip
    ? { "data-tooltip-id": "app-tooltip", "data-tooltip-content": tooltip }
    : {}

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...tooltipProps}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      onClick={onClick}
      {...tooltipProps}
    >
      {children}
    </a>
  )
}

export default CyberLink
