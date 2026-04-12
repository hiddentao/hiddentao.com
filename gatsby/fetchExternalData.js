const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories?q=user:hiddentao+fork:false&sort=stars&order=desc&per_page=5'

const PROJECT_CONFIG = [
  {
    id: 'nipper',
    name: 'Nipper',
    url: 'https://nipper.to',
    fallbackDescription: null,
  },
  {
    id: 'cloud-simulator',
    name: 'Cloud simulator',
    url: 'https://clouds.hiddentao.com',
    fallbackDescription: 'Pixelated clouds in the browser.',
  },
]

const fetchGithubRepos = async () => {
  const headers = { 'User-Agent': 'hiddentao.com-build', Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(GITHUB_SEARCH_URL, { headers })
  if (!res.ok) {
    throw new Error(`GitHub search API returned ${res.status} ${res.statusText}`)
  }

  const body = await res.json()
  return body.items.map(item => ({
    name: item.name,
    description: item.description || '',
    url: item.html_url,
    stars: item.stargazers_count,
    language: item.language || null,
  }))
}

const extractMeta = (html, property) => {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i'),
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m) return m[1].trim()
  }
  return null
}

const extractTitle = html => {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m ? m[1].trim() : null
}

const fetchProject = async config => {
  const res = await fetch(config.url, { headers: { 'User-Agent': 'hiddentao.com-build' } })
  if (!res.ok) {
    throw new Error(`${config.url} returned ${res.status} ${res.statusText}`)
  }

  const html = await res.text()

  const title =
    extractMeta(html, 'og:title') ||
    extractTitle(html) ||
    config.name

  const description =
    extractMeta(html, 'og:description') ||
    extractMeta(html, 'description') ||
    config.fallbackDescription ||
    ''

  return {
    id: config.id,
    name: config.name,
    title,
    description,
    url: config.url,
  }
}

const fetchExternalData = async () => {
  const [githubRepos, projects] = await Promise.all([
    fetchGithubRepos(),
    Promise.all(PROJECT_CONFIG.map(fetchProject)),
  ])
  return { githubRepos, projects }
}

module.exports = { fetchExternalData }
