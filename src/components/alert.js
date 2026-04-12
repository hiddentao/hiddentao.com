import React from 'react'
import { cx } from '../utils/cx'

const Alert = ({ className, children }) => (
  <div
    className={cx("border-2 border-dashed border-crayola bg-crayola rounded-[10px] text-[1.2rem] font-bold py-2 px-4 text-center [&>p]:mb-4 [&>p:last-child]:mb-0", className)}
  >
    {children}
  </div>
)

export default Alert
