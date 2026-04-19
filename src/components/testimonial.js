import trunc from "lodash.truncate"
import React, { useState, useCallback } from "react"
import { cx } from "../utils/cx"

const Testimonial = ({ className, name, company, text }) => {
  const [expanded, setExpanded] = useState()
  const expand = useCallback(e => {
    e.preventDefault()
    setExpanded(true)
  }, [])

  return (
    <div className={cx("bg-transparent", className)}>
      <p className="text-2xl leading-snug font-sans italic font-thin text-grey before:content-[open-quote] after:content-[close-quote]">
        {text.length > 200 && !expanded ? (
          <span>
            {trunc(text, { length: 200, omission: " " })}
            <a
              onClick={expand}
              href="#"
              data-tooltip-id="app-tooltip"
              data-tooltip-content="Read full testimonial"
            >
              ...
            </a>
          </span>
        ) : (
          text
        )}
      </p>
      <p className="text-white text-right mt-2 text-md">
        - {name} ({company})
      </p>
    </div>
  )
}

export default Testimonial
