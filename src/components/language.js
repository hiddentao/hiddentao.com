import React from "react"
import Popup from "reactjs-popup"
import styled from '@emotion/styled'
import { useStaticQuery, graphql, navigate } from "gatsby"
import { IntlContextConsumer, injectIntl } from "gatsby-plugin-intl"

import Button from './button'

// modified from https://github.com/wiziple/gatsby-plugin-intl/blob/master/src/link.js
const changeLocale = (language, { defaultLanguage }) => {
  const removeLocalePart = pathname => {
    const { routed } = window.___gatsbyIntl
    if (!routed) {
      return pathname
    }
    const i = pathname.indexOf(`/`, 1)
    return pathname.substring(i)
  }
  const pathname = removeLocalePart(window.location.pathname)
  const link = `${language === defaultLanguage ? '' : `/${language}`}${pathname}${window.location.search}`
  window.localStorage.setItem("gatsby-intl-language", language)
  navigate(link)
}

const ModalTitle = styled.h3`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.languageModal.title.textColor};
`

const ChangeButton = styled(Button)`
  font-size: 1rem;
`

const LanguageButton = styled(Button)`
  margin-bottom: 0.4rem;
  width: 100%;
`

const LanguageList = styled.div`
  button {
    display: inline;
    margin-right: 0.5rem;
    width: auto;
    font-size: 0.5rem;
  }
`

const getLanguageLabel = (supportedLanguages, id) => {
  const r = supportedLanguages.find(l => l.id === id)
  return r ? r.label : null
}

const LangList = ({ intl, defaultLanguage, currentLanguage, availableLanguages, supportedLanguages }) => {
  return (
    <LanguageList>
      {availableLanguages.map(l => (
        <LanguageButton
          key={l}
          onClick={() => changeLocale(l, { defaultLanguage })}
        >
          {getLanguageLabel(supportedLanguages, currentLanguage)}
        </LanguageButton>
      ))}
    </LanguageList>
  )
}

const LangPopup = ({ intl, defaultLanguage, currentLanguage, availableLanguages, supportedLanguages }) => {
  return (
    <Popup
      trigger={
        <ChangeButton title={intl.formatMessage({ id: 'change-language' })}>
          {getLanguageLabel(supportedLanguages, currentLanguage)} ✍
        </ChangeButton>
      }
      position="top center"
      modal={true}
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.65)',
      }}
      contentStyle={{
        padding: '1em',
        width: '300px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <>
        <ModalTitle>{intl.formatMessage({ id: 'change-language' })}</ModalTitle>
        {availableLanguages.map(language => (
          <LanguageButton
            key={language}
            onClick={() => changeLocale(language, { defaultLanguage })}
          >
            {getLanguageLabel(supportedLanguages, language)}
          </LanguageButton>
        ))}
      </>
    </Popup>
  )
}

const Language = ({ showAsList, className, ...props }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            supportedLanguages {
              id
              label
            }
            defaultLanguage
          }
        }
      }
    `
  )

  const { defaultLanguage, supportedLanguages } = data.site.siteMetadata

  return (
    <IntlContextConsumer>
      {({ language: currentLanguage }) => {
        const p = {
          ...props,
          currentLanguage,
          defaultLanguage,
          supportedLanguages,
        }

        return (
          <div className={className}>{
            showAsList ? (
              <LangList {...p} />
            ) : (
              <LangPopup {...p} />
            )
          }</div>
        )
      }}
    </IntlContextConsumer>
  )
}

export default injectIntl(Language)
