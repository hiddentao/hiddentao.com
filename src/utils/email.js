const user = "ram"
const domain = "hiddentao.com"

export const getEmailHref = () => `mailto:${user}@${domain}`

export const handleEmailClick =
  (extraOnClick) =>
  (e) => {
    e.preventDefault()
    if (extraOnClick) extraOnClick(e)
    window.location.href = getEmailHref()
  }
