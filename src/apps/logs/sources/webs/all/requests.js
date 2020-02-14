import * as Debug from 'debug'
const debug = Debug('apps:logs:sources:webs:all:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const logs_webs_paths = {
  params: function (_key, vm) {
    let source
    let key

    if (!_key) {
      key = ['hosts.range']
    }

    debug('PERIODICAL %o %o', _key, vm)
    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      // const END = 1557134755000 //= > home test data
      const END = 1557246080000 //= > office test data

      /**
      * production
      **/
      // const END = Date.now()

      const START = END - HOUR

      source = [{
        params: { id: _key },
        // range: 'posix ' + (Date.now() - HOUR) + '-' + Date.now() + '/*', //prod
        range: 'posix ' + START + '-' + END + '/*',

        path: 'all',
        query: {
          'from': 'logs',
          'index': 'path',
          'q': [
            // { 'config': 'graph' },
            { 'metadata': ['host', 'path', 'domain'] } // 'path' ain't needed for first view (categories)
          ],
          // 'transformation': [
          //   { 'orderBy': { 'index': 'r.desc(timestamp)' } }
          //   // 'slice:0:9'
          // ],
          'aggregation': 'distinct'
        }
      }]
    }

    // debug('MyChart periodical KEY ', key, source)

    // if (!vm.web) {
    //
    // }

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
    // let _hosts_paths = {}
    // let _paths = []

    let webs = []
    if (data && data.logs && data.logs.length > 0) {
      // debug('CALLBACK', data)

      Array.each(data.logs, function (group) {
        debug('GROUP', group)
        Array.each(group, function (row) {
          webs.push(row.metadata)
          //       let host = plugin.metadata.host
          //       // debug('All callback', plugin)
          //       let path = (plugin.metadata.path) ? plugin.metadata.path : undefined
          //
          //       if (!_hosts_paths[host]) _hosts_paths[host] = []
          //
          //       if (path !== undefined) {
          //         path = path.replace('os.', '')
          //         if (path.indexOf('.') > -1) { path = path.substring(0, path.indexOf('.')) }
          //       }
          //       if (path !== undefined && !_hosts_paths[host].contains(path)) _hosts_paths[host].push(path)
          //
          //       if (!_paths.contains(path)) _paths.push(path)
        })
      })
      //
      //   Object.each(_hosts_paths, function (paths, host) {
      //     paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
      //   })
      //
      webs.sort(function (a, b) { return (a.domain > b.domain) ? 1 : ((b.domain > a.domain) ? -1 : 0) })

      if (webs.length > 0) {
        vm.webs = webs
        vm.loading = false
      }

    //   vm.paths = _paths
    }

    // debug('CATEGORIES callback %o %o', _hosts_paths, _categories)
  }
}

const once = [
  logs_webs_paths
]

const periodical = [
  // logs_webs_paths
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, logs_webs_paths }
export default requests
