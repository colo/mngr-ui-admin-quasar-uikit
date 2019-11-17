import * as Debug from 'debug'
const debug = Debug('apps:vhosts:sources:requests')

const nginx_vhosts_enabled = {
  params: {
    path: 'all',
    query: {
      'from': 'vhosts',
      'index': 'hosts',
      'q': [
        'data',
        { 'metadata': ['host', 'timestamp'] }// timestamp give us last update
      ],
      'filter': [ { 'metadata': { 'path': 'vhosts.nginx.enabled' } } ]
    }
  },
  callback: function (tables, metadata, key, vm) {
    debug('All callback', tables, JSON.parse(JSON.stringify(this)))
  }
}

const once = [
  nginx_vhosts_enabled
]

const periodical = [
  nginx_vhosts_enabled
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, nginx_vhosts_enabled }
export default requests
