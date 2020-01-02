import * as Debug from 'debug'
const debug = Debug('app:munin:sources:categories_requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const munin_categories_paths = {
  params: function (_key, vm) {
    debug('PERIODICAL %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['categories.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        range: 'posix ' + (Date.now() - (15 * SECOND)) + '-' + Date.now() + '/*',
        path: 'all',
        query: {
          'from': 'munin',
          'index': 'path',
          'q': [
            { 'config': 'graph' },
            // { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
            { 'metadata': ['host', 'path'] } // 'path' ain't needed for first view (categories)
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
  //     'from': 'os',
  //     'index': 'host',
  //     'q': [
  //       { 'config': 'graph' },
  //       { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
  //     ],
  //     'aggregation': 'distinct'
  //   }
  // },
  callback: function (data, meta, key, vm) {
    debug('CATEGORIES CALLBACK', data)
    let _categories_paths = {}
    let _hosts = []

    if (data && data.munin && data.munin.length > 0) {
      Array.each(data.munin, function (host_group) {
        Array.each(host_group, function (plugin) {
          let host = plugin.metadata.host
          // debug('All callback', plugin)
          // let path = (plugin.metadata.path) ? plugin.metadata.path : undefined
          let category = (plugin.config && plugin.config.graph && plugin.config.graph.category) ? plugin.config.graph.category.toLowerCase() : 'uncategorized'

          if (!_categories_paths[category]) _categories_paths[category] = []

          if (!_categories_paths[category].contains(host)) _categories_paths[category].push(host)

          if (!_hosts.contains(host)) _hosts.push(host)
        })
      })

      Object.each(_categories_paths, function (hosts, category) {
        hosts.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
      })

      _hosts.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })

      vm.categories_paths = _categories_paths
      vm.hosts = _hosts
    }

    // debug('CATEGORIES callback %o %o', _categories_paths, _categories)
  }
}

const once = [
  munin_categories_paths
]

const periodical = [
  munin_categories_paths
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, munin_categories_paths }
export default requests
