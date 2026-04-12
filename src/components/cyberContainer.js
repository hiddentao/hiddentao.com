import React from "react"
import { cx } from '../utils/cx'

const CyberContainer = ({ className, children }) => (
  <div className={cx("cyber-container mt-12", className)}>
    {children}
  </div>
)

export default CyberContainer
