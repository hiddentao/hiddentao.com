import React from 'react'
import { Link } from 'gatsby'
import { formatDate } from "../utils/date"
import { cx } from '../utils/cx'

const PostList = ({ className, posts }) => (
  <div className={cx(className)}>
    <ul className="list-none p-0">
      {posts.map(post => (
        <li
          key={post.path}
          className="flex items-start mb-3.5 desktop:mb-4 text-xl desktop:text-2xl leading-snug"
        >
          <span className="text-sm desktop:text-base leading-snug min-w-16 desktop:min-w-20 font-light text-grey flex-none">{formatDate(post.date, 'MMM DD')}</span>
          <span className="flex-1"><Link to={post.path}>{post.title}</Link></span>
        </li>
      ))}
    </ul>
  </div>
)

export default PostList
