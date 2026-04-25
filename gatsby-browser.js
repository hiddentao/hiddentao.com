import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { version } from './package.json'
import './src/styles/global.css'
import 'react-tooltip/dist/react-tooltip.css'

LogRocket.init('kzlsfn/hiddentaocom', { release: version })
setupLogRocketReact(LogRocket)
