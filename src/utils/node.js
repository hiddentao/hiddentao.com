import safeGet from 'lodash.get'

export const getVersionForLanguage = (versions, lang) => (
  versions.find(v => v.lang === lang)
)

export const getResolvedVersionForLanguage = (versions, lang, fallbackLang) => {
  const current = getVersionForLanguage(versions, lang)
  const fallback = getVersionForLanguage(versions, fallbackLang)

  const fields = [
    'title',
    'date',
    'markdown',
  ].reduce((m, f) => {
    m[f] = safeGet(current, f, fallback[f])
    return m
  }, {})

  return fields
}
