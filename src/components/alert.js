import React from 'react'

const Alert = ({ className, children }) => (
  <div
    className={`border-2 border-dashed border-[var(--color-crayola)] bg-[var(--color-crayola)] rounded-[10px] text-[1.2rem] font-bold py-2 px-4 text-center [&>p]:mb-4 [&>p:last-child]:mb-0 ${className || ''}`}
  >
    {children}
  </div>
)

export default Alert
