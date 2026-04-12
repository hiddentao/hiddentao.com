import React from "react"
import { cx } from '../utils/cx'

const CyberSection = ({ tag, id, className, children }) => (
  <section className={cx("cyber-section", className)} id={id}>
    {tag && <div className="section-tag mono"># {tag}</div>}
    {children}
  </section>
)

export default CyberSection
