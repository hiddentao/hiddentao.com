import React from "react"

const Section = ({ children, className }) => (
  <div
    className={`bg-[var(--color-darkest-grey)] text-white border border-[var(--color-darkest-grey)] p-8 rounded-[10px] shadow-[0_2px_2px_rgba(0,0,0,0.75)] [&_a]:text-[var(--color-caribbean-green)] [&_a]:border [&_a]:border-transparent [&_a:hover]:text-white [&_a:hover]:bg-[var(--color-caribbean-green)] [&_a:hover]:border-[var(--color-caribbean-green)] ${className || ''}`}
  >
    {children}
  </div>
)

export default Section
