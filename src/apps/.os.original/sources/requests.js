import * as Debug from 'debug'
const debug = Debug('apps:os:sources:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const os_hosts_paths = {
  params: function (_key, vm) {
    debug('PERIODICAL %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['hosts.range']
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
          'from': 'os',
          'index': 'host',
          'q': [
            // { 'config': 'graph' },
            { 'metadata': ['host', 'path', 'tag'] } // 'path' ain't needed for first view (categories)
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
    debug('CALLBACK', data)
    let _hosts_paths = {}
    let _paths = []

    if (data && data.os && data.os.length > 0) {
      Array.each(data.os, function (host_group) {
        Array.each(host_group, function (plugin) {
          let host = plugin.metadata.host
          // debug('All callback', plugin)
          let path = (plugin.metadata.path) ? plugin.metadata.path.toLowerCase() : undefined

          if (!_hosts_paths[host]) _hosts_paths[host] = []
          if (path !== undefined && !_hosts_paths[host].contains(path)) _hosts_paths[host].push(path)

          if (!_paths.contains(path)) _paths.push(path)
        })
      })

      Object.each(_hosts_paths, function (paths, host) {
        paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
      })

      _paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })

      vm.hosts_paths = _hosts_paths
      vm.paths = _paths
    }

    // debug('CATEGORIES callback %o %o', _hosts_paths, _categories)
  }
}

const once = [
  os_hosts_paths
]

const periodical = [
  os_hosts_paths
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, os_hosts_paths }
export default requests
