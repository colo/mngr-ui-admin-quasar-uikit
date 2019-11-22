import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:requests')

const munin_hosts_categories = {
  params: {
    path: 'all',
    query: {
      'from': 'munin',
      'index': 'host',
      'q': [
        { 'config': 'graph' },
        { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
      ],
      'aggregation': 'distinct'
    }
  },
  callback: function (data, meta, key, vm) {
    // debug('All callback', data)
    let _hosts_categories = {}
    if (data && data.munin && data.munin.length > 0) {
      Array.each(data.munin, function (host_group) {
        Array.each(host_group, function (plugin) {
          let host = plugin.metadata.host
          // debug('All callback', plugin)
          let category = (plugin.config && plugin.config.graph) ? plugin.config.graph.category : undefined

          if (!_hosts_categories[host]) _hosts_categories[host] = []
          if (category !== undefined && !_hosts_categories[host].contains(category)) _hosts_categories[host].push(category)
        })
      })
    }

    debug('All callback', _hosts_categories)
  }
}

const once = [
  munin_hosts_categories
]

const periodical = [
  munin_hosts_categories
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, munin_hosts_categories }
export default requests
