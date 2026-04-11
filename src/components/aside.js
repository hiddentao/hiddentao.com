import React from "react"

import SocialLinks from "./socialLinks"
import Icon from "./icon"
import RamImage from './ramImage'

const Aside = ({ className }) => (
  <aside className={className}>
    <RamImage size='75%' />
    <div className="mt-4 mb-3 ml-4 [&>svg]:min-w-[2em]">
      <Icon name={['fas', 'map-pin']} /><span>London, UK</span>
    </div>
    <SocialLinks className="ml-4" />
  </aside>
)

export default Aside
