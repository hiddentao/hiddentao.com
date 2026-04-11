import { Link } from "gatsby"
import React, { useCallback, useState } from "react"
import { Location } from '@reach/router'

import Icon from './icon'

const _isViewingUrl = (location, regex) => !!location.pathname.match(regex)

const linkClass = "text-white no-underline hover:text-[var(--color-caribbean-green)] data-[selected=true]:text-[var(--color-caribbean-green)]"

const NAV_ITEMS = [
  { to: '/services', label: '/services', regex: /services/ },
  { to: '/blog', label: '/blog', regex: /blog/ },
  { to: '/projects', label: '/projects', regex: /projects/ },
  { to: '/talks', label: '/talks', regex: /talks/ },
]

const renderLinks = (location) => NAV_ITEMS.map(({ to, label, regex }) => (
  <Link key={to} to={to} data-selected={_isViewingUrl(location, regex)} className={linkClass}>
    {label}
  </Link>
))

const Header = ({ navLinks, ...props }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!mobileMenuOpen),
    [ mobileMenuOpen, setMobileMenuOpen ]
  )

  return (
    <div {...props} className="w-full py-4 px-5">
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
          className="desktop:hidden block bg-transparent text-white border-none cursor-pointer text-[1.2rem] transition-transform duration-200"
          style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <Icon name={['fas', 'bars']} />
        </button>
      </nav>

      {mobileMenuOpen && (
        <Location>
          {({ location }) => (
            <div className="flex flex-col gap-4 pt-4 border-t border-dashed border-[var(--color-darkest-grey)] mt-4 mono">
              {renderLinks(location)}
            </div>
          )}
        </Location>
      )}
    </div>
  )
}

export default Header
