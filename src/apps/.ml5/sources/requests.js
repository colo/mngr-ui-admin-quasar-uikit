import * as Debug from 'debug'
import * as ss from 'simple-statistics'

const debug = Debug('apps:ml5:sources:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

let prev = []
const transform = function (values, column) {
  debug('transform %o', values, prev)
  let transformed = JSON.parse(JSON.stringify(values))
  if (prev.length === 0 || (transformed.length > 0 && transformed[0] !== null && prev[0] > values[0][0])) { // timestamp check
    prev = transformed.shift()
    // chart.prev = values[0]
  }

  // Array.each(values, function (row) {
  for (let i = 0; i < transformed.length; i++) {
    let row = transformed[i]
    if (row && row !== null && row[0] > prev[0]) {
      let prev_row = Array.clone(row)

      // Array.each(row, function (col, index) {
      for (let index = 0; index < row.length; index++) {
        let col = row[index]
        if (index > 0 && (column === undefined || index === column || column.contains(index))) { // index == 0 == timestamp
          row[index] = col - prev[index]
          row[index] = (col - prev[index]) / ((row[0] - prev[0]) / 1000) // DERIVE
        }
      }
      // })

      prev = prev_row
    }
  }
  // })

  debug('transform2', JSON.parse(JSON.stringify(transformed)))

  return JSON.parse(JSON.stringify(transformed))
}

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
            range: 'posix ' + (Date.now() - HOUR) + '-' + Date.now() + '/*',
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
                // { 'metadata': { 'type': 'minute' } },
                // "this.r.row('metadata')('path').eq('os.cpus').or(this.r.row('metadata')('path').eq('os.rethinkdb.server.written_docs'))"
                "this.r.row('metadata')('path').eq('os.cpus')" +
                ".or(this.r.row('metadata')('path').eq('os.blockdevices.vda3.time'))" +
                ".or(this.r.row('metadata')('path').eq('os.blockdevices.vda3.sectors'))" +
                ".or(this.r.row('metadata')('path').eq('os.rethinkdb.server.written_docs'))" +
                ".or(this.r.row('metadata')('path').eq('os.rethinkdb.server.read_docs'))"
              ]

            }
          }]
          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    debug('CALLBACK data %s %o', key, data, metadata)

    if (data && data.os && data.os.length > 0) {
      let docs = {}
      Array.each(data.os, function (row) {
        let ts = row.metadata.timestamp
        if (!docs[ts]) docs[ts] = { idle: undefined, written: undefined }
        if (row.metadata.path === 'os.cpus') {
          docs[ts].idle = row.data.idle
        } else if (row.metadata.path === 'os.rethinkdb.server.read_docs') {
          docs[ts].read = Math.round(row.data.per_sec) * 1
        } else if (row.metadata.path === 'os.rethinkdb.server.written_docs') {
          docs[ts].written = Math.round(row.data.per_sec) * 1
        } else if (row.metadata.path === 'os.blockdevices.vda3.sectors') {
          docs[ts].sectors = row.data.write_sectors + row.data.read_sectors
        } else if (row.metadata.path === 'os.blockdevices.vda3.time') {
          docs[ts].time_in_queue = row.data.time_in_queue
        }
      })

      let arr_docs = []
      let tss = Object.keys(docs)
      tss.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) }) // sort by timestamp
      Array.each(tss, function (ts) {
        ts *= 1
        // arr_docs.push([ts, docs[ts].per_sec, docs[ts].idle])
        arr_docs.push([ts, docs[ts].read, docs[ts].written, docs[ts].sectors, docs[ts].time_in_queue, docs[ts].idle])
      })

      // arr_docs = arr_docs.filter(doc => (doc[1] !== undefined && doc[2] !== undefined))
      arr_docs = arr_docs.filter(doc => (doc[1] !== undefined && doc[2] !== undefined && doc[3] !== undefined && doc[4] !== undefined && doc[5] !== undefined))

      arr_docs = transform(arr_docs, [3, 4, 5])
      // arr_docs = transform(arr_docs, [1, 2, 3])

      // arr_docs = arr_docs.filter(doc => (doc[1] > 0 && doc[2] > 0))
      arr_docs = arr_docs.filter(doc => (doc[1] >= 0 && doc[2] >= 0 && doc[3] >= 0 && doc[4] >= 0 && doc[5] >= 0))

      // const LENGTH = 2
      let final_docs = []
      let current_row = []
      // // // let current_row = [[], []]
      // let current_row = [[], [], [], [], []]
      //
      // // let current_row = [0, 0]
      // // let current_row = [0, 0, 0]
      // for (let i = 0; i < arr_docs.length; i++) {
      //   let row = arr_docs[i]
      //   // debug('CALLBACK ROW %o', current_row, i, i % LENGTH)
      //   if (i === 0 || (i % LENGTH !== 0)) {
      //     current_row[0].push(row[1])
      //     current_row[1].push(row[2])
      //     current_row[2].push(row[3])
      //     current_row[3].push(row[4])
      //     current_row[4].push(row[5])
      //   } else {
      //     current_row[0] = ss.median(current_row[0])
      //     current_row[1] = ss.median(current_row[1])
      //     current_row[2] = ss.median(current_row[2])
      //     current_row[3] = ss.median(current_row[3])
      //     current_row[4] = ss.median(current_row[4])
      //
      //     final_docs.push(Array.clone(current_row))
      //
      //     // current_row = [[], []]
      //     current_row = [[], [], [], [], []]
      //     current_row[0].push(row[1])
      //     current_row[1].push(row[2])
      //     current_row[2].push(row[3])
      //     current_row[3].push(row[4])
      //     current_row[4].push(row[5])
      //   }
      // }
      for (let i = 0; i < arr_docs.length; i++) {
        let row = JSON.parse(JSON.stringify(arr_docs[i]))
        // debug('CALLBACK ROW %o', current_row, i)
        current_row[0] = row[1]
        current_row[1] = row[2]
        current_row[2] = row[3]
        current_row[3] = row[4]
        current_row[4] = row[5]

        final_docs.push(Array.clone(current_row))
        current_row = []
      }
      debug('CALLBACK DOCS %o', final_docs)
      if (arr_docs.length > 0) { vm.values = final_docs }
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
