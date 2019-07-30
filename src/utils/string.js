import remark from 'remark'
import strip from 'strip-markdown'

export const calculateReadTimeInMinutes = markdown => {
  const words = remark().use(strip).processSync(markdown).contents

  const count = words.trim().split(/\s+/).length

  return parseInt(Math.ceil(count / 265.0))
}
