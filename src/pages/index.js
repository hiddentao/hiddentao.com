import { keyframes } from '@emotion/core'
import React, { useMemo } from "react"
import styled from '@emotion/styled'
import { useStaticQuery, graphql } from 'gatsby'
import { IntlContextConsumer, Link } from 'gatsby-plugin-intl'
import { flex, childAnchors } from 'emotion-styled-utils'

import Layout from "../components/layout"
import SEO from "../components/seo"
import MaxContentWidth from "../components/maxContentWidth"
import PostList from "../components/postList"
import RamImage from "../components/ramImage"
import Section from "../components/section"
import Testimonial from "../components/testimonial"
import { TwitterLink, GithubLink, LinkedInLink, EmailLink, FeedLink } from '../components/socialLinks'
import { getResolvedVersionForLanguage } from '../utils/node'


const Content = styled(MaxContentWidth)`
  max-width: 90%;

  & > h2 {
    font-size: 2rem;
    text-align: center;
  }
`

const Splash = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  margin-top: 2rem;
  margin-bottom: 3rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    margin-top: 4rem;
  }
`

const SplashTop = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};
  margin-bottom: 3rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    margin-bottom: 1rem;
  }
`

const SplashDivider = styled.div`
  width: 100px;
  height: 0px;
  border-bottom: 5px dotted ${({ theme }) => theme.splash.dividerColor};
`

const SplashBottom = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center', wrap: 'wrap' })};
  margin-top: 2rem;
  text-align: center;
  max-width: 80%;

  ${({ theme }) => childAnchors(theme.splash.anchor)};

  a {
    ${flex({ direction: 'row', justify: 'center', align: 'center', basis: 0 })};
    font-size: 1.6rem;
    margin: 0.8rem;

    svg {
      color: ${({ theme }) => theme.splash.anchor.hoverTextColor};
    }

    span {
      font-size: 70%;
      margin-left: 1rem;
      white-space: nowrap;
      text-transform: lowercase;
    }
  }

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    a {
      font-size: 2.7rem;
      margin: 2rem;
    }
  }
`

const SplashAvatarImage = styled(RamImage)`
  display: none;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    display: block;
  }
`

const highlightedTextAnimation = keyframes`
  0% {
    color: inherit;
  }

  50% {
    color: #333;
  }

  100% {
    color: inherit;
  }
`

const SplashText = styled.div`
  ${({ theme }) => theme.font('header', 'bold')};
  font-size: 2.4rem;
  line-height: 1.4em;
  max-width: 90%;
  text-align: center;

  em {
    animation: ${highlightedTextAnimation} 3s ease-in-out infinite;
  }

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    text-align: initial;
    font-size: 2.7rem;
    margin-left: 4rem;
  }
`

const KeyPoints = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'stretch', wrap: 'wrap' })};
`

const KeyPoint = styled(Section)`
  margin: 2rem 0;

  h2 {
    margin-top: 0;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.section.heading.textColor};
  }

  ul {
    list-style-type: disc;
    font-size: 1.2rem;
    line-height: 1.3em;
    margin-left: 2rem;

    li {
      margin: 0 0 0.5em;
    }
  }

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    width: 40%;
    margin: 1.8rem;
  }
`

const Testimonials = styled.div`
  margin-bottom: 6rem;
`

const StyledTestimonial = styled(Testimonial)`
  margin: 4rem auto;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    width: 800px;
  }
`

const MoreTestimonials = styled.div`
  text-align: center;
  font-size: 1.2rem;
`

const StyledPostList = styled(PostList)`
  margin: 0 auto;
`

const Page = ({ lang }) => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }, limit: 10 ) {
        nodes {
          ...MarkdownPageFields
        }
      }
    }
  `)

  const posts = useMemo(() => {
    return data.allMarkdownPage.nodes
      .map(n => ({
        ...getResolvedVersionForLanguage(n.versions, lang, n.lang),
        path: n.path,
      }))
  }, [ data, lang ])

  return (
    <Layout noHeader={true} noAside={true}>
      <SEO />
      <Content>
        <Splash>
          <SplashTop>
            <SplashAvatarImage size={300} />
            <SplashText>
              Hey! I'm <em>Ram</em>, a full-stack developer based in London, UK
            </SplashText>
          </SplashTop>
          <SplashDivider />
          <SplashBottom>
            <TwitterLink />
            <GithubLink />
            <LinkedInLink />
            <EmailLink />
            <FeedLink />
          </SplashBottom>
        </Splash>
        <KeyPoints>
          <KeyPoint>
            <h2>Started coding at 11</h2>
            <ul>
              <li>Started with BASIC/QBasic.</li>
              <li>Have used C/C++, Java, Python, PHP, Ruby, Javascript, Solidity.</li>
              <li>Currently in blockchain space, learning ML/AI.</li>
              <li>...see <GithubLink>my open source code</GithubLink>.</li>
            </ul>
          </KeyPoint>
          <KeyPoint>
            <h2>Pro since 2005</h2>
            <ul>
              <li>Imperial College London graduate.</li>
              <li>Freelance since 2009, worked with 15+ clients.</li>
              <li>Given <Link to='/talks'>talks</Link>, ran <a href="https://www.meetup.com/javascript-enthusiasts/">meetups</a> and mentored people.</li>
              <li>...see <LinkedInLink>my work</LinkedInLink>.</li>
            </ul>
          </KeyPoint>
          <KeyPoint>
            <h2>Budding entrepreneur</h2>
            <ul>
              <li><a href="https://kickback.events">Kickback</a> - incentivizing event attendance.</li>
              <li><a href="https://solui.dev">solUI</a> - generate Dapps without coding.</li>
              <li><a href="https://msk.sh">Mailmask</a> - stop unwanted email.</li>
            </ul>
          </KeyPoint>
        </KeyPoints>
        <h2>What other people say</h2>
        <Testimonials>
          <StyledTestimonial
            text='Ram is an exceptionally talented Senior Engineer. His role at Photobox was to lead efforts in replatforming the core website (full-stack node.js and React), not only through his wealth of experience in quality programming, but also by acting as a mentor to less experienced members on the team. Several months on he is still fondly remembered by those that had the pleasure to work with him, setting a very high standard for others to follow.'
            name='Ersan Hakki'
            company='Photobox'
          />
          <StyledTestimonial
            text='I unreservedly recommend Ram for any position, specifically full stack, nodejs, reactjs and especially smart contract/blockchain development. Ram joined our team at Nayms Limited to assist by developing a complex set of smart contracts on the Ethereum network. He is self motivated and takes personal pride in the software he creates. As the space is rapidly advancing, he was able to guide us through evolving best practices while consistently delivering ahead of schedule. He not only exceeded our expectations with the specific task he was assigned, but also happily assisted other team members with tasks in other areas whenever there was a problem that required a team effort. He is thorough in his deliverables and happily explains and documents his work.'
            name='Theodore Georgas'
            company='Nayms'
          />
          <StyledTestimonial
            text={`If I'd known Ram growing up, I would have wanted to become an Engineer.

Across four projects, I'm humbled that Ram has served as a technical lead. With exceptional complexity, incredibly high standards and strenuous 3rd party dependencies - Ram always delivered on time, on budget and on scope.

He’s centered, diligent and whip-smart. There’d be funny times when a partner would blast off an ill tempered message and I’d just chuckle because I knew Ram would elevate the conversation to a higher place of respect, temperament and action.`}
            name='James Shamenski'
            company='Bananas'
          />
          <MoreTestimonials>
            <LinkedInLink>See more testimonials</LinkedInLink>
          </MoreTestimonials>
        </Testimonials>
        <h2>Latest blog posts</h2>
        <StyledPostList posts={posts} />
      </Content>
    </Layout>
  )
}


const IndexPage = () => (
  <IntlContextConsumer>
    {({ language: lang }) => (
      <Page lang={lang} />
    )}
  </IntlContextConsumer>
)

export default IndexPage
