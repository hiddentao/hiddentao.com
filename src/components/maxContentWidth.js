import React from "react"
import { cx } from "../utils/cx"

const MaxContentWidth = ({ className, children, width = "1024px" }) => (
  <div className={cx("w-full mx-auto", `max-w-[${width}]`, className)}>
    {children}
  </div>
)

export default MaxContentWidth
