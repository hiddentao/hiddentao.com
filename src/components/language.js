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
  margin-top: 0;
`

const ChangeButton = styled(Button)`
  font-size: 0.5rem;
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

const LangList = ({ intl, defaultLanguage, currentLanguage, availableLanguages }) => {
  return (
    <LanguageList>
      {availableLanguages.map(l => (
        <LanguageButton
          key={l}
          onClick={() => changeLocale(l, { defaultLanguage })}
        >
          {intl.formatMessage({ id: l })}
        </LanguageButton>
      ))}
    </LanguageList>
  )
}

const LangPopup = ({ intl, defaultLanguage, currentLanguage, availableLanguages }) => {
  return (
    <Popup
      trigger={
        <ChangeButton title={intl.formatMessage({ id: 'change-language' })}>
          {intl.formatMessage({ id: currentLanguage })} ↵
        </ChangeButton>
      }
      position="top center"
      modal={true}
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.5)',
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
            {intl.formatMessage({ id: language })}
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
            supportedLanguages
            defaultLanguage
          }
        }
      }
    `
  )

  const { defaultLanguage } = data.site.siteMetadata

  return (
    <IntlContextConsumer>
      {({ language: currentLanguage }) => (
        <div className={className}>{
          showAsList ? (
            <LangList {...props} currentLanguage={currentLanguage} defaultLanguage={defaultLanguage} />
          ) : (
            <LangPopup {...props} currentLanguage={currentLanguage} defaultLanguage={defaultLanguage} />
          )
        }</div>
      )}
    </IntlContextConsumer>
  )
}

export default injectIntl(Language)
