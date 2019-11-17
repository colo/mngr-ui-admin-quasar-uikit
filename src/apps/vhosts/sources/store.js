import * as Debug from 'debug'
const debug = Debug('apps:vhosts:sources:store')

const nginx_vhosts_enabled = {
  params: {
    path: 'all',
    query: {
      'from': 'vhosts',
      'index': 'hosts',
      'q': [
        'data',
        { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
      ]
      // 'filter': [ { 'metadata': { 'path': 'vhosts.nginx.enabled' } } ]
    }
  },
  callback: function (tables, metadata, key, vm) {
    debug('STORE callback', tables, this)
    this.some_data.test = false
  }
}

const store = [
  nginx_vhosts_enabled
]

// export { periodical, once, nginx_vhosts_error }
export default store
