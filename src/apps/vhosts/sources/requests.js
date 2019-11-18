import * as Debug from 'debug'
const debug = Debug('apps:vhosts:sources:requests')

const nginx_vhosts_enabled = {
  params: {
    path: 'all',
    query: {
      'from': 'vhosts',
      'index': false,
      'q': [
        'data',
        { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
      ]
      // 'filter': [ { 'metadata': { 'path': 'vhosts.nginx.enabled' } } ]
    }
  },
  callback: function (data, meta, key, vm) {
    let _vhosts = []
    debug('All callback', data.vhosts)
    Array.each(data.vhosts, function (vhost) {
      let _vhost = Object.merge(vhost.data, vhost.metadata)

      _vhosts.push(_vhost)
    })

    _vhosts.sort(function (a, b) { return (a.uri > b.uri) ? 1 : ((b.uri > a.uri) ? -1 : 0) })

    vm.vhosts = _vhosts
    debug('All callback', _vhosts)
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
