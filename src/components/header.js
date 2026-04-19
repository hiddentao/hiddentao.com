import { Link } from "gatsby"
import React from "react"
import { Location } from "@reach/router"
import { cx } from "../utils/cx"

import Icon from "./icon"

const _isViewingUrl = (location, regex) => !!location.pathname.match(regex)

const linkClass =
  "text-white no-underline hover:!text-white px-2 py-0.5 data-[selected=true]:text-white data-[selected=true]:outline data-[selected=true]:outline-1 data-[selected=true]:outline-white data-[selected=true]:outline-offset-2 data-[selected=true]:rounded"
const mobileLinkClass =
  "text-white no-underline hover:text-white hover:bg-caribbean-green data-[selected=true]:text-white data-[selected=true]:outline data-[selected=true]:outline-1 data-[selected=true]:outline-white data-[selected=true]:px-2 data-[selected=true]:py-0.5 data-[selected=true]:rounded"

const NAV_ITEMS = [
  { to: "/services", label: "/services", regex: /services/ },
  { to: "/blog", label: "/blog", regex: /blog/ },
  { to: "/code", label: "/code", regex: /code/ },
  { to: "/talks", label: "/talks", regex: /talks/ },
]

const renderLinks = (location, className = linkClass) =>
  NAV_ITEMS.map(({ to, label, regex }) => (
    <Link
      key={to}
      to={to}
      data-selected={_isViewingUrl(location, regex)}
      className={className}
    >
      {label}
    </Link>
  ))

const Header = ({ navLinks, mobileMenuOpen, setMobileMenuOpen, ...props }) => {
  return (
    <div {...props} className="w-full px-5 relative">
      <nav className="flex justify-between items-center text-white text-[1.1rem] mono py-4">
        <Link to="/" className="brand">
          hiddentao
        </Link>
        <Location>
          {({ location }) => (
            <div className="hidden desktop:flex gap-8">
              {renderLinks(location)}
            </div>
          )}
        </Location>
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className={cx(
            "desktop:hidden self-stretch w-10 flex items-center justify-center text-white cursor-pointer text-[1.2rem] border",
            mobileMenuOpen
              ? "bg-standard border-dark-grey border-b-0"
              : "bg-transparent border-transparent"
          )}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={cx(
              "transition-transform duration-200 inline-flex",
              mobileMenuOpen ? "rotate-90" : "rotate-0"
            )}
          >
            <Icon name={["fas", "bars"]} />
          </span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <Location>
          {({ location }) => (
            <div className="absolute top-full -mt-4 left-5 right-5 z-10 bg-standard border-l border-r border-b border-dark-grey px-4 py-4 flex flex-col gap-4 mono">
              {renderLinks(location, mobileLinkClass)}
            </div>
          )}
        </Location>
      )}
    </div>
  )
}

export default Header
