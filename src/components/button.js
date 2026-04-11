import React from "react"

const Button = ({ className, disabled, children, ...rest }) => (
  <button
    disabled={disabled}
    className={`cursor-pointer rounded-[5px] px-[1em] py-[0.5em] text-base border transition-colors bg-transparent text-[var(--color-caribbean-green)] border-[var(--color-caribbean-green)] hover:bg-[var(--color-caribbean-green)] hover:text-black disabled:bg-[var(--color-grey)] disabled:text-[var(--color-dark-grey)] disabled:border-[var(--color-grey)] disabled:cursor-not-allowed ${className || ''}`}
    {...rest}
  >
    {children}
  </button>
)

export default Button
