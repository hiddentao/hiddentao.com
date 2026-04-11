import React, { Fragment } from 'react'
import { css, Global } from '@emotion/react'
import { useTheme } from '@emotion/react'
import { resetStyles, childAnchors } from 'emotion-styled-utils'

const cyberStyles = css`
  :root {
    --paradise-pink: #ef476f;
    --crayola: #ffd166;
    --caribbean-green: #06d6a0;
    --blue-ncs: #118ab2;
    --midnight: #073b4c;
    --violet: #6a4c93;
    --base: #02080a;
    --surface: #0a1922;
  }

  body {
    background-color: transparent;
    color: #e0e0e0;
    font-family: 'Bricolage Grotesque', sans-serif;
  }

  .scanline {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
    background-size: 100% 4px;
    z-index: 999;
    pointer-events: none;
    opacity: 0.4;
  }

  .cyber-container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
  .mono { font-family: 'Fira Code', monospace; }

  .cyber-nav {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding-top: 1rem;
    color: var(--caribbean-green); font-size: 1.1rem;
  }
  a.brand { font-size: 1.25rem; font-weight: bold; color: #fff; text-decoration: none;}
  a.brand:hover { color: var(--caribbean-green); }
  .nav-links { display: flex; gap: 2rem; }
  .nav-links a { color: var(--caribbean-green); text-decoration: none; }
  .nav-links a:hover { color: #fff; }

  .terminal-top {
    background: #000; border: 1px solid #333; border-bottom: none;
    padding: 0.5rem 1rem; display: flex; gap: 0.5rem; border-radius: 8px 8px 0 0;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-r { background: var(--paradise-pink); }
  .dot-y { background: var(--crayola); }
  .dot-g { background: var(--caribbean-green); }

  .hero {
    background: var(--surface); border: 1px solid #333; border-radius: 0 0 8px 8px;
    padding: 3rem; box-shadow: 0 0 40px rgba(255, 255, 255, 0.03);
    position: relative; overflow: hidden; display: flex; gap: 3rem; flex-wrap: wrap; align-items: center;
  }
  .hero-content { flex: 1; min-width: 300px; }
  .hero-img {
    width: 250px; height: 250px; border-radius: 50%; border: 2px solid #333;
    object-fit: cover; display: block; margin: 0 auto;
  }

  .cyber-h1 { font-size: 3.5rem; margin: 0; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); line-height: 1.1; }
  .subtitle { font-size: 1.2rem; color: #888; margin: 1rem 0 2rem 0; }
  .btn-container { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .cyber-btn {
    padding: 1rem 1.5rem; font-family: 'Fira Code', monospace; font-size: 1rem;
    text-decoration: none; text-transform: uppercase; transition: all 0.2s; cursor: pointer;
    background: transparent; color: var(--caribbean-green); border: 1px solid var(--caribbean-green);
    box-shadow: 0 0 15px rgba(6, 214, 160, 0.2);
  }
  .cyber-btn:hover {
    background: var(--caribbean-green); color: var(--base);
    box-shadow: 0 0 25px rgba(6, 214, 160, 0.6);
  }

  .logo-bar {
    display: flex; justify-content: space-between; gap: 2rem; flex-wrap: wrap; align-items: center;
    padding: 3rem 0; border-bottom: 1px dashed #333; margin-bottom: 4rem; color: #888; font-size: 1.25rem;
  }

  .cyber-section { margin-top: 6rem; }
  .section-tag { color: #888; font-size: 1.2rem; margin-bottom: 2rem; display: inline-block; }

  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  .glass-card { background: rgba(10, 25, 34, 0.8); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 4px; transition: all 0.3s; }
  a.glass-card:hover { border-color: var(--caribbean-green); box-shadow: 0 10px 30px rgba(6, 214, 160, 0.1); }
  .glass-card h3 { color: #fff; font-size: 1.4rem; margin: 0; }
  .glass-card p { color: #aaa; line-height: 1.6; font-size: 1rem; margin-top:1rem;}

  .metrics {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem;
    background: var(--surface); border: 1px solid #333; padding: 2rem; border-radius: 4px;
  }
  .metric-item { text-align: center;}
  .metric-value { font-size: 2.5rem; color: #fff; font-weight: 700; }
  .metric-label { margin-top: 0.5rem; color: #888; font-size: 0.85rem; }

  .testimonial-box { border-left: 4px solid #333; padding: 2rem; background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%); margin-bottom: 2rem; }
  .testimonial-box p { font-size: 1.2rem; font-style: italic; color: #e0e0e0; }
  .testimonial-author { color: #888; margin-top: 1rem; }

  .grid-2 { display: grid; grid-template-columns: 1fr; gap: 4rem; }
  @media(min-width:768px){ .grid-2{grid-template-columns: 1fr 1fr;} }

  .repo-card { border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; margin-bottom: 1rem; background: #000; text-decoration: none; display: block; transition: all 0.2s;}
  .repo-card:hover { border-color: var(--caribbean-green); transform: translateX(5px);}
  .repo-card h4 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: var(--caribbean-green); display: flex; justify-content: space-between;}
  .repo-card p { margin: 0; color: #888; font-size: 0.95rem; font-family: 'Bricolage Grotesque', sans-serif;}

  .writing-list { list-style: none; padding: 0; margin: 0;}
  .writing-list a { display: block; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 1.5rem 0; text-decoration: none; color: var(--caribbean-green); transition: color 0.2s;}
  .writing-list a:hover { color: #fff; }
  .writing-list .meta { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; color: #888;}
  .writing-list .tag { background: rgba(255,255,255,0.05); color: #888; padding: 2px 8px; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.8rem;}

  .cyber-footer { border-top: 1px solid #333; padding: 4rem 0; margin-top: 6rem; width: 100%; max-width: 1100px; margin: 6rem auto 0 auto;}
  .subfooter { display: flex; justify-content: space-between; align-items: center; margin-top: 4rem; flex-wrap: wrap; gap: 2rem;}
  .subfooter a { color: var(--caribbean-green); text-decoration: none; margin-left: 1.5rem;}
  .subfooter a:hover { color: #fff; }
`

const GlobalStyles = () => {
  const theme = useTheme()

  return (
    <Fragment>
      {/* <link rel='stylesheet' href='https://unpkg.com/@fortawesome/fontawesome-svg-core@1.2.17/styles.css' integrity='sha384-bM49M0p1PhqzW3LfkRUPZncLHInFknBRbB7S0jPGePYM+u7mLTBbwL0Pj/dQ7WqR' crossOrigin='anonymous' /> */}
      <Global styles={css(resetStyles)} />
      <Global styles={css`
        * {
          box-sizing: border-box;
        }

        html {
          ${theme.font('body')};
          font-size: 16px;

          ${theme.media.when({ minW: 'mobile' })} {
            font-size: 18px;
          }
        }

        ${childAnchors({
          ...theme.anchor,
          extraStyles: `
            cursor: pointer;
            text-decoration: none;
          `
        })};

        h1, h2, h3 {
          ${theme.font('header')};
          margin: 1.8em 0 1em;
          font-weight: bolder;
          line-height: 1em;
        }

        h1 {
          font-size: 2.1rem;
          margin: 0 0 1.8em;
        }

        h2 {
          font-size: 1.5em;
        }

        h3 {
          font-weight: 300;
          font-size: 1.2em;
      `} />
      <Global styles={cyberStyles} />
    </Fragment>
  )
}

export default GlobalStyles