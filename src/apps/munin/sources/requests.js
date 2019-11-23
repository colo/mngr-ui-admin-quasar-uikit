import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:requests')

const MINUTE = 60000

const munin_hosts_categories = {
  params: function (_key, vm) {
    debug('PERIODICAL %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['host_categories.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
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
      }]
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  // params: {
  //   path: 'all',
  //   query: {
  //     'from': 'munin',
  //     'index': 'host',
  //     'q': [
  //       { 'config': 'graph' },
  //       { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
  //     ],
  //     'aggregation': 'distinct'
  //   }
  // },
  callback: function (data, meta, key, vm) {
    // debug('All callback', data)
    let _hosts_categories = {}
    let _categories = []

    if (data && data.munin && data.munin.length > 0) {
      Array.each(data.munin, function (host_group) {
        Array.each(host_group, function (plugin) {
          let host = plugin.metadata.host
          // debug('All callback', plugin)
          let category = (plugin.config && plugin.config.graph) ? plugin.config.graph.category : undefined

          if (!_hosts_categories[host]) _hosts_categories[host] = []
          if (category !== undefined && !_hosts_categories[host].contains(category)) _hosts_categories[host].push(category)

          if (!_categories.contains(category)) _categories.push(category)
        })
      })

      vm.hosts_categories = _hosts_categories
      vm.categories = _categories
    }

    debug('All callback %o %o', _hosts_categories, _categories)
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
