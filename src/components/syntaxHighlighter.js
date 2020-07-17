/* eslint-disable import/first */
import React from 'react'
import Highlighter, { registerLanguage } from "react-syntax-highlighter/dist/prism-light"

import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
registerLanguage('bash', bash)
registerLanguage('shell', bash)

import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
registerLanguage('c', c)

import coffeescript from 'react-syntax-highlighter/dist/esm/languages/prism/coffeescript'
registerLanguage('coffeescript', coffeescript)
registerLanguage('coffee', coffeescript)

import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
registerLanguage('cpp', cpp)
registerLanguage('c++', cpp)

import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
registerLanguage('css', css)

import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff'
registerLanguage('diff', diff)

import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
registerLanguage('docker', docker)

import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
registerLanguage('go', go)

import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql'
registerLanguage('graphql', graphql)

import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
registerLanguage('java', java)

// import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
registerLanguage('javascript', jsx)
registerLanguage('js', jsx)
registerLanguage('jsx', jsx)
registerLanguage('solidity', jsx)

import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
registerLanguage('json', json)

import makefile from 'react-syntax-highlighter/dist/esm/languages/prism/makefile'
registerLanguage('makefile', makefile)
registerLanguage('make', makefile)

import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
registerLanguage('markdown', markdown)
registerLanguage('md', markdown)

import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx'
registerLanguage('nginx', nginx)

import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec'
registerLanguage('objectivec', objectivec)
registerLanguage('objc', objectivec)

import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
registerLanguage('php', php)

import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
registerLanguage('python', python)

import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
registerLanguage('ruby', ruby)
registerLanguage('rb', ruby)

import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
registerLanguage('rust', rust)
registerLanguage('rs', rust)

import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
registerLanguage('sql', sql)

import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
registerLanguage('yaml', yaml)
registerLanguage('yml', yaml)

import solidity from './syntax-highlighting/solidity'
registerLanguage('solidity', solidity)

import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism'

const SyntaxHighlighter = ({ language, children }) => (
  <Highlighter language={language} style={prism}>{children}</Highlighter>
)

export default SyntaxHighlighter
