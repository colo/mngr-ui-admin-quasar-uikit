'use strict'
const App = require('node-app-socket.io-client/index')
import DefaultConn from '@etc/default.io'

let _app = new App(Object.merge(DefaultConn, { path: '/logs' }))
export default _app.io
