import React from 'react'

const MaxContentWidth = ({ className, children, width = '1024px' }) => (
  <div
    className={`w-full mx-auto ${className || ''}`}
    style={{ maxWidth: width }}
  >
    {children}
  </div>
)

export default MaxContentWidth
