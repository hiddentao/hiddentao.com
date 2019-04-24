import React from 'react'
import { Link } from 'gatsby-plugin-intl'
import styled from '@emotion/styled'

import { postListItemDateColor } from '../styles/common'
import { mq } from '../styles/breakpoints'
import { formatDate } from "../utils/date"

const Container = styled.div`
  ul {
    list-style: none;
    display: block;
    padding: 0;
    li {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 0.7rem;
      font-size: 1rem;
      line-height: 1.4rem;
      span {
        flex: 0;
        min-width: 4em;
        font-weight: lighter;
        color: ${postListItemDateColor};
      }
      a {
        flex: 1;
      }
    }
  }
`

const UL = styled.ul(() => mq({
  marginLeft: ['0', '1rem'],
}))

const PostList = ({ className, posts }) => (
  <Container className={className}>
    <UL>
      {posts.map(post => (
        <li key={post.path}>
          <span>{formatDate(post.date, 'MMM DD')}</span>
          <Link to={post.path}>{post.title}</Link>
        </li>
      ))}
    </UL>
  </Container>
)

export default PostList
