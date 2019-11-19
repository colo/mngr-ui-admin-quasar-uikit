import * as Debug from 'debug'
const debug = Debug('apps:checks:sources:requests')

const MINUTE = 60000

const checks_range = {
  params: function (_key, vm) {
    let source
    let key

    if (!_key) {
      key = ['checks.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        path: 'all',
        range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
        query: {
          'from': 'educativa',
          'index': false,
          'q': [
            'data',
            { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
          ],
          'transformation': [
            { 'orderBy': { 'index': 'r.desc(timestamp)' } }
            // 'slice:0:9'
          ],
          'filter': [ { 'metadata': { 'type': 'check' } } ]
        }
      }]
    }

    return { key, source }
  },
  callback: function (data, meta, key, vm) {
    debug('All callback RANGE', data)

    if (data && data.educativa && data.educativa.length > 0) {
      let _checks = []
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
}

const checks_lasts = {
  params: {
    path: 'all',
    query: {
      'from': 'educativa',
      'index': false,
      'q': [
        'data',
        { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
      ],
      'transformation': [
        { 'orderBy': { 'index': 'r.desc(timestamp)' } },
        'slice:0:9'
      ],
      'filter': [ { 'metadata': { 'type': 'check' } } ]
    }
  },
  callback: function (data, meta, key, vm) {
    let _checks = []
    debug('All callback ONCE', data)
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
  checks_lasts
]

const periodical = [
  // nginx_vhosts_enabled
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, checks_lasts }
export default requests
