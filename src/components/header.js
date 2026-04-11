import { Link } from "gatsby"
import React, { useCallback, useState } from "react"
import { Location } from '@reach/router'

import Icon from './icon'

const _isViewingUrl = (location, regex) => !!location.pathname.match(regex)

const linkClass = "text-white no-underline hover:text-[var(--color-caribbean-green)] data-[selected=true]:text-[var(--color-caribbean-green)]"
const mobileLinkClass = "text-white no-underline hover:text-white hover:bg-[var(--color-caribbean-green)] data-[selected=true]:text-[var(--color-caribbean-green)]"

const NAV_ITEMS = [
  { to: '/services', label: '/services', regex: /services/ },
  { to: '/blog', label: '/blog', regex: /blog/ },
  { to: '/projects', label: '/projects', regex: /projects/ },
  { to: '/talks', label: '/talks', regex: /talks/ },
]

const renderLinks = (location, className = linkClass) => NAV_ITEMS.map(({ to, label, regex }) => (
  <Link key={to} to={to} data-selected={_isViewingUrl(location, regex)} className={className}>
    {label}
  </Link>
))

const Header = ({ navLinks, ...props }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!mobileMenuOpen),
    [ mobileMenuOpen, setMobileMenuOpen ]
  )

  return (
    <div {...props} className="w-full py-4 px-5" style={mobileMenuOpen ? { backgroundColor: '#02080a' } : undefined}>
      <nav className="flex justify-between items-center text-white text-[1.1rem] mono">
        <Link to="/" className="brand">hiddentao</Link>
        <Location>
          {({ location }) => (
            <div className="hidden desktop:flex gap-8">
              {renderLinks(location)}
            </div>
          )}
        </Location>
        <button
          onClick={toggleMobileMenu}
          className={`desktop:hidden self-stretch w-10 flex items-center justify-center bg-transparent text-white cursor-pointer text-[1.2rem] border ${mobileMenuOpen ? 'border-[var(--color-dark-grey)] border-b-0' : 'border-transparent'}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className="transition-transform duration-200 inline-flex"
            style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <Icon name={['fas', 'bars']} />
          </span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <Location>
          {({ location }) => (
            <div>
              <div className="flex">
                <div className="flex-1 border-t border-[var(--color-dark-grey)]"></div>
                <div className="w-10 shrink-0"></div>
              </div>
              <div className="border-l border-r border-b border-[var(--color-dark-grey)] px-4 py-4 flex flex-col gap-4 mono">
                {renderLinks(location, mobileLinkClass)}
              </div>
            </div>
          )}
        </Location>
      )}
    </div>
  )
}

export default Header
