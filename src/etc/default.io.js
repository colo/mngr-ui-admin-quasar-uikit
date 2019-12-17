'use strict'

export default {
  scheme: 'ws',
  host: 'localhost',
  port: 8080,
  io: { forceNew: false, transports: ['websocket'] }
}
