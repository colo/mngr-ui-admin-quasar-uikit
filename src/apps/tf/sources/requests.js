import * as Debug from 'debug'
const debug = Debug('apps:tf:sources:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const host_once_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['periodical.once']// 'config.once', 'minute.once'
    }

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (10 * MINUTE)) + '-' + Date.now() + '/*',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            query: {
              'from': 'os',
              // 'register': 'changes',
              // 'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                { 'metadata': ['path', 'timestamp'] }
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': 'elk' } },
                "this.r.row('metadata')('path').eq('os.cpus').or(this.r.row('metadata')('path').eq('os.rethinkdb.server.written_docs'))"
              ]

            }
          }]
          break

        // case 'config.once':
        //   source = [{
        //     params: { id: _key },
        //     range: 'posix ' + (Date.now() - 15 * SECOND) + '-' + Date.now() + '/*',
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
        //     query: {
        //       'from': 'os',
        //       // 'index': false,
        //
        //       'q': [
        //         // 'id',
        //         'config',
        //         { 'metadata': ['path'] }
        //       ],
        //       // 'transformation': [
        //       //   { 'orderBy': { 'index': 'r.desc(timestamp)' } }
        //       //   // 'slice:0:1'
        //       // ],
        //       'aggregation': 'distinct',
        //       'filter': [{ 'metadata': { 'host': vm.host } }]
        //     }
        //   }]
        //
        //   break
        // case 'minute.once':
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     query: {
        //       'from': 'os_historical',
        //       // 'register': 'changes',
        //       'format': 'tabular',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         // 'metadata',
        //         'data'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       'filter': [
        //         { 'metadata': { 'host': vm.host } },
        //         { 'metadata': { 'type': 'minute' } },
        //         "r.row('metadata')('path').ne('os.procs')"
        //       ]
        //
        //     }
        //   }]
        //
        //   break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    // debug('CALLBACK data %s %o', key, data, metadata)

    if (data && data.os && data.os.length > 0) {
      let docs = {}
      Array.each(data.os, function (row) {
        let ts = row.metadata.timestamp
        if (!docs[ts]) docs[ts] = { idle: undefined, written: undefined }
        if (row.metadata.path === 'os.cpus') {
          docs[ts].idle = row.data.idle
        } else if (row.metadata.path === 'os.rethinkdb.server.written_docs') {
          docs[ts].written = row.data.per_sec
        }
      })

      const cleaned = Object.values(docs).filter(doc => (doc.idle !== undefined && doc.written !== undefined))

      debug('CALLBACK DOCS %o', cleaned)
      if (cleaned.length > 0) { vm.values = cleaned }
    }
  }

}
const once = [
  host_once_component
]
const periodical = undefined

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
