import React from 'react'
import styled from '@emotion/styled'

import { bodyColor } from '../styles/common'
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
    color: ${bodyColor};
  }
  a {
    text-decoration: none;
    span {
      text-decoration: underline;
    }
  }
`


const SocialLinks = ({ className }) => {
  return (
    <SocialList className={className}>
      <SocialListItem title="RSS">
        <a href="http://feedpress.me/hiddentao">
          <Icon name={['fas', 'rss']} /><span>Feed</span>
        </a>
      </SocialListItem>
      <SocialListItem title="Email">
        <a href="mailto:ram@hiddentao.com">
          <Icon name={['fas', 'envelope']} /><span>Email</span>
        </a>
      </SocialListItem>
      <SocialListItem title="Twitter">
        <a href="https://twitter.com/hidentao">
          <Icon name={['fab', 'twitter']} /><span>Twitter</span>
        </a>
      </SocialListItem>
      <SocialListItem title="Github">
        <a href="https://github.com/hiddentao">
          <Icon name={['fab', 'github']} /><span>Github</span>
        </a>
      </SocialListItem>
      <SocialListItem title="Linked-in">
        <a href="https://linked.com/in/hiddentao">
          <Icon name={['fab', 'linkedin']} /><span>Linked-in</span>
        </a>
      </SocialListItem>
      <SocialListItem title="Stack Overflow">
        <a href="https://stackoverflow.com/users/207619/hiddentao">
          <Icon name={['fab', 'stack-overflow']} /><span>Stack Overflow</span>
        </a>
      </SocialListItem>
    </SocialList>
  )
}

export default SocialLinks
