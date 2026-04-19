import React from "react"
import { cx } from "../utils/cx"

import Icon from "./icon"

const itemClasses =
  "mb-4 [&>a]:no-underline [&>a_span]:underline [&>a_svg]:min-w-8 [&>a_svg]:text-white [&_span]:ml-1"

export const GithubLink = ({ children }) => (
  <a href="https://github.com/hiddentao">
    {children || (
      <React.Fragment>
        <Icon name={["fab", "github"]} />
        <span>Github</span>
      </React.Fragment>
    )}
  </a>
)

export const LinkedInLink = ({ children }) => (
  <a href="https://www.linkedin.com/in/hiddentao/">
    {children || (
      <React.Fragment>
        <Icon name={["fab", "linkedin"]} />
        <span>Linked-in</span>
      </React.Fragment>
    )}
  </a>
)

export const EmailLink = ({ children }) => (
  <a href="mailto:ram@hiddentao.com">
    {children || (
      <React.Fragment>
        <Icon name={["fas", "envelope"]} />
        <span>Email</span>
      </React.Fragment>
    )}
  </a>
)

export const InvestmentLink = ({ children }) => (
  <a href="https://hiddentao.vc">
    {children || (
      <React.Fragment>
        <Icon name={["fas", "torii-gate"]} />
        <span>Investments</span>
      </React.Fragment>
    )}
  </a>
)

export const FeedLink = ({ children }) => (
  <a href="https://hiddentao.com/feed.xml">
    {children || (
      <React.Fragment>
        <Icon name={["fas", "rss"]} />
        <span>RSS</span>
      </React.Fragment>
    )}
  </a>
)

export const XLink = ({ children }) => (
  <a href="https://x.com/TaoOfDev">
    {children || (
      <React.Fragment>
        <Icon name={["fab", "twitter"]} />
        <span>X</span>
      </React.Fragment>
    )}
  </a>
)

const SocialLinks = ({ className }) => (
  <ul className={cx("list-none block", className)}>
    <li className={itemClasses} title="X">
      <XLink />
    </li>
    <li className={itemClasses} title="Github">
      <GithubLink />
    </li>
    <li className={itemClasses} title="Linked-in">
      <LinkedInLink />
    </li>
    <li className={itemClasses} title="Email">
      <EmailLink />
    </li>
  </ul>
)

export default SocialLinks
