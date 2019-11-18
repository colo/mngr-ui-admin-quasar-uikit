import * as Debug from 'debug'
const debug = Debug('apps:checks:sources:requests')

const nginx_vhosts_enabled = {
  params: {
    path: 'all',
    query: {
      'from': 'educativa',
      'index': false,
      'q': [
        'data',
        { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
      ],
      'filter': [ { 'metadata': { 'type': 'check' } } ]
    }
  },
  callback: function (data, meta, key, vm) {
    let _checks = []
    debug('All callback', data)
    Array.each(data.educativa, function (check) {
      let _check = Object.merge(check.data, check.metadata)

      _checks.push(_check)
    })

    _checks.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })

    vm.checks = _checks
    vm.loading = false
    debug('All callback', _checks)
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
