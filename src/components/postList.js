import React from 'react'
import { Link } from 'gatsby'
import { formatDate } from "../utils/date"

const PostList = ({ className, posts }) => (
  <div className={`text-[1.3rem] desktop:text-[1.5rem] ${className || ''}`}>
    <ul className="list-none block p-0">
      {posts.map(post => (
        <li
          key={post.path}
          className="flex flex-row justify-start items-start mb-[0.7em] text-[1em] leading-[1.4] [&>span:first-of-type]:text-[70%] [&>span:first-of-type]:flex-none [&>span:first-of-type]:min-w-[4em] [&>span:first-of-type]:font-light [&>span:first-of-type]:text-[var(--color-grey)] [&>span:last-of-type]:flex-1"
        >
          <span>{formatDate(post.date, 'MMM DD')}</span>
          <span><Link to={post.path}>{post.title}</Link></span>
        </li>
      ))}
    </ul>
  </div>
)

export default PostList
