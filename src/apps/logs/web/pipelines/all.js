'use strict'

// import InputIOApp from '@libs/input/poller/io.app'
import { EventBus } from '@libs/eventbus'

import InputIO from '../../pipelines/input/io'

// import DefaultConn from '@etc/default.io'

// const App = require ( 'node-app-socket.io-client/index' )
// let app_io = new App(DefaultConn)

let buffer = {}

import * as Debug from 'debug'
const debug = Debug('apps:logs:web:pipelines:all')

let qs = require('qs')

export default {
  input: [
    {
      poll: {
        suspended: true,
        id: 'input.logs.webs.all',
        conn: [

          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'input.logs.webs.all',
              module: InputIO

            }
          )

        ],
        connect_retry_count: -1,
        connect_retry_periodical: 1000,
        requests: {
          periodical: 10000
        }
      }
    }

  ],
  filters: [
    function (doc, opts, next, pipeline) {
      debug('filter', doc, qs.stringify(doc.metadata.opts.query))
      if (doc.metadata.opts.params && doc.metadata.opts.params.id) {
        doc.id = doc.metadata.opts.params.id
      } else {
        doc.id = doc.metadata.input + '?' + qs.stringify(doc.metadata.opts.query)
      }
      // let newDoc = Object.clone(doc)
      // newDoc.key = ''
      //
      // // // newDoc.input = doc.input
      // // // newDoc[doc.input] = doc[doc.input]
      // // //
      // // // let key = {}
      // // //
      // // // if (doc.opts.params && Object.keys(doc.opts.params).length > 0) { key.params = doc.opts.params }
      // // //
      // // // if (doc.opts.query && Object.keys(doc.opts.query).length > 0) { key.query = doc.opts.query }
      // // //
      // // // if (Object.keys(key).length > 0) { newDoc.key = JSON.stringify(key) }
      // // //
      // if (newDoc.metadata.from) { newDoc.key += newDoc.metadata.from + '_' }
      //
      // if (newDoc.metadata.opts && newDoc.metadata.opts.params && newDoc.metadata.opts.params.props) {
      //   newDoc.key += 'props=' + newDoc.metadata.opts.params.props + '_'
      //
      //   if (newDoc.metadata.opts.params.value) {
      //     try {
      //       newDoc.key += ':' + JSON.stringify(newDoc.metadata.opts.params.value) + '_'
      //     } catch (e) {
      //       newDoc.key += ':' + newDoc.metadata.opts.params.value + '_'
      //     }
      //   }
      // }
      //
      // newDoc.key = newDoc.key.substring(0, newDoc.key.lastIndexOf('_'))

      // debug('filter newDoc', newDoc)
      next(doc, opts, next, pipeline)
    }
  ],
  output: [
    function (payload) {
      if (!payload.err && /^input\.logs\.webs\.all\[.*\]$/.test(payload.id)) {
        payload.id = payload.id.replace('input.logs.webs.all[', '').slice(0, -1)
        debug('OUTPUT', payload)
        EventBus.$emit('input.logs.webs.all.' + payload.metadata.input, payload)
      }

      // if (!payload.err) { EventBus.$emit('log', payload) }
    }
  ]
}
