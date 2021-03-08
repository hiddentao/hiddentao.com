import remark from 'remark'
import strip from 'strip-markdown'

export const calculateReadTimeInMinutes = markdown => {
  const words = stripMarkdown(markdown)
  const count = words.trim().split(/\s+/).length
  return parseInt(Math.ceil(count / 265.0))
}


export const stripMarkdown = str => {
  return remark().use(strip).processSync(str).contents
}