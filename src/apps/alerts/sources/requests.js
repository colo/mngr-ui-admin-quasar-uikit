import * as Debug from 'debug'
const debug = Debug('apps:alerts:sources:requests')

const nginx_vhosts_enabled = {
  params: {
    path: 'all',
    query: {
      'from': 'educativa',
      'index': false,
      'q': [
        'data',
        { 'metadata': ['timestamp', 'path'] }// timestamp give us last update
      ],
      'filter': [ { 'metadata': { 'type': 'alert' } } ]
    }
  },
  callback: function (data, meta, key, vm) {
    let _alerts = []
    debug('All callback', data)
    Array.each(data.educativa, function (alerts) {
      Object.each(alerts.data, function (alert, host) {
        // debug('All callback', host, alert)
        Object.each(alert, function (alert_data, hostname) {
          // debug('All callback', host, alert_data, hostname)
          let _alert = Object.merge({ host: host, alert: hostname, data: alert_data }, alerts.metadata)
          _alerts.push(_alert)
        })
        // let name = alert.getKeys()[0]
        // let alert_data = alert[name]
        //
        //
      })
    })

    _alerts.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })

    vm.alerts = _alerts
    vm.loading = false
    debug('All callback', _alerts)
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
