import React from 'react'
import { Link } from 'gatsby-plugin-intl'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import { formatDate } from "../utils/date"

const Container = styled.div`
  font-size: 1.3rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    font-size: 1.5rem;
  }

  ul {
    list-style: none;
    display: block;
    padding: 0;

    li {
      ${flex({ direction: 'row', justify: 'flex-start', align: 'flex-start' })}
      margin-bottom: 0.7em;
      font-size: 1em;
      line-height: 1.4em;

      span {
        &:first-of-type {
          font-size: 70%;
          flex: 0;
          min-width: 4em;
          font-weight: lighter;
          color: ${({ theme }) => theme.postList.date.textColor};
        }

        &:last-of-type {
          flex: 1
        }
      }
    }
  }
`

const UL = styled.ul``

const PostList = ({ className, posts }) => (
  <Container className={className}>
    <UL>
      {posts.map(post => (
        <li key={post.path}>
          <span>{formatDate(post.date, 'MMM DD')}</span>
          <span><Link to={post.path}>{post.title}</Link></span>
        </li>
      ))}
    </UL>
  </Container>
)

export default PostList
