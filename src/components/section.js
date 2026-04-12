import React from "react"
import { cx } from '../utils/cx'

const Section = ({ children, className }) => (
  <div
    className={cx("bg-darkest-grey text-white border border-darkest-grey p-8 rounded-[10px] shadow-[0_2px_2px_color-mix(in_srgb,var(--color-black)_75%,transparent)] [&_a]:text-caribbean-green [&_a]:border [&_a]:border-transparent [&_a:hover]:text-white [&_a:hover]:bg-caribbean-green [&_a:hover]:border-caribbean-green", className)}
  >
    {children}
  </div>
)

export default Section
