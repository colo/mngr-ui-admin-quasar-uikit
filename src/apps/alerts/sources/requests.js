import * as Debug from 'debug'
const debug = Debug('apps:alerts:sources:requests')

const MINUTE = 60000

const alerts_range = {
  params: function (_key, vm) {
    let source
    let key

    if (!_key) {
      key = ['alerts.range']
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
            { 'metadata': ['timestamp', 'path'] }// timestamp give us last update
          ],
          'transformation': [
            { 'orderBy': { 'index': 'r.desc(timestamp)' } }
            // 'slice:0:9'
          ],
          'filter': [ { 'metadata': { 'type': 'alert' } } ]
        }
      }]
    }

    return { key, source }
  },
  callback: function (data, meta, key, vm) {
  // let _alerts = JSON.parse(JSON.stringify(vm.alerts))
    debug('All callback RANGE', data)
    if (data && data.educativa && data.educativa.length > 0) {
      let _alerts = []
      debug('All callback RANGE', data)
      Array.each(data.educativa, function (alerts) {
        Object.each(alerts.data, function (alert, host) {
          // debug('All callback', host, alert)
          Object.each(alert, function (alert_data, hostname) {
            // debug('All callback', host, alert_data, hostname)
            let _alert = Object.merge({ host: host, alert: hostname, data: alert_data }, alerts.metadata)
            _alerts.push(_alert)
            // if (!_alerts.some(function (item, index) {
            //   return (item.alert === _alert.alert && item.timestamp === _alert.timestamp)
            // })) { _alerts.push(_alert) }
          })
        })
      })

      _alerts.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })

      vm.alerts = _alerts
      vm.loading = false
      debug('All callback RANGE', _alerts)
    }
  }

}

const alerts_lasts = {
  params: {
    path: 'all',
    query: {
      'from': 'educativa',
      'index': false,
      'q': [
        'data',
        { 'metadata': ['timestamp', 'path'] }// timestamp give us last update
      ],
      'transformation': [
        { 'orderBy': { 'index': 'r.desc(timestamp)' } },
        'slice:0:9'
      ],
      'filter': [ { 'metadata': { 'type': 'alert' } } ]
    }
  },
  callback: function (data, meta, key, vm) {
    // let _alerts = JSON.parse(JSON.stringify(vm.alerts))
    let _alerts = []
    debug('All callback ONCE', data)
    Array.each(data.educativa, function (alerts) {
      Object.each(alerts.data, function (alert, host) {
        // debug('All callback', host, alert)
        Object.each(alert, function (alert_data, hostname) {
          // debug('All callback', host, alert_data, hostname)
          let _alert = Object.merge({ host: host, alert: hostname, data: alert_data }, alerts.metadata)
          _alerts.push(_alert)
          // if (!_alerts.some(function (item, index) {
          //   return (item.alert === _alert.alert && item.timestamp === _alert.timestamp)
          // })) { _alerts.push(_alert) }
        })
      })
    })

    _alerts.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })

    vm.alerts = _alerts
    vm.loading = false
    debug('All callback', _alerts)
  }
}

const once = [
  alerts_lasts
]

const periodical = [
  alerts_range
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, alerts_range, alerts_lasts }
export default requests
