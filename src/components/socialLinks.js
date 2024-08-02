import React from 'react'
import styled from '@emotion/styled'

import Icon from './icon'

const SocialList = styled.ul`
  list-style: none;
  display: block;
`

const SocialListItem = styled.li`
  margin-bottom: 1em;
  span {
    margin-left: 0.2em;
  }
  svg {
    min-width: 2em;
    color: ${({ theme }) => theme.textColor};
  }
  a {
    text-decoration: none;
    span {
      text-decoration: underline;
    }
  }
`

export const GithubLink = ({ children }) => (
  <a href="https://github.com/hiddentao">
    {children || (
      <React.Fragment>
        <Icon name={['fab', 'github']} /><span>Github</span>
      </React.Fragment>
    )}
  </a>
)

export const LinkedInLink = ({ children }) => (
  <a href="https://www.linkedin.com/in/hiddentao/">
    {children || (
      <React.Fragment>
        <Icon name={['fab', 'linkedin']} /><span>Linked-in</span>
      </React.Fragment>
    )}
  </a>
)

export const EmailLink = ({ children }) => (
  <a href="mailto:ram@hiddentao.com">
    {children || (
      <React.Fragment>
        <Icon name={['fas', 'envelope']} /><span>Email</span>
      </React.Fragment>
    )}
  </a>
)

export const FeedLink = ({ children }) => (
  <a href="https://hiddentao.com/feed.xml">
    {children || (
      <React.Fragment>
        <Icon name={['fas', 'rss']} /><span>RSS</span>
      </React.Fragment>
    )}
  </a>
)

const SocialLinks = ({ className }) => {
  return (
    <SocialList className={className}>
      <SocialListItem title="Github">
        <GithubLink />
      </SocialListItem>
      <SocialListItem title="Linked-in">
        <LinkedInLink />
      </SocialListItem>
      <SocialListItem title="Email">
        <EmailLink />
      </SocialListItem>
      <SocialListItem title="RSS">
        <FeedLink />
      </SocialListItem>
    </SocialList>
  )
}

export default SocialLinks
