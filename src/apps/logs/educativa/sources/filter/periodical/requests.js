import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:sources:filter:minute:periodical')

// import END from '../../../etc/range'
const end = require('../../../../etc/end')

const NANOSECOND = 1000000
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24

const ss = require('simple-statistics')

// const _merge = function (prop, val1, val2) {
//   // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   let merged
//
//   if (!isNaN(val1)) { // && !isNaN(val2)
//     if (val2 === undefined) val2 = 0
//     merged = val1 + val2 * 1
//   } else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
//     // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
//     merged = {}
//
//     merged.max = ss.max([val1.max * 1, val2.max * 1])
//     merged.min = ss.min([val1.min * 1, val2.min * 1])
//     merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
//     merged.range = val1.max - val1.min
//     merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
//     merged.median = ss.median([val1.median * 1, val2.median * 1])
//     // delete val1.mode
//   } else if (
//     (prop !== 'geoip') &&
//     isNaN(val1) &&
//     isNaN(val2)
//   ) {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     // if (Array.isArray(val1)) {
//     //   merged = []
//     //   Array.each(val1, function (val1_data, val1_index) {
//     //     merged.push(_merge(prop, val1_data, val2[val1_index]))
//     //   })
//     // } else {
//     merged = {}
//     merged = _merge_objects(prop, val1, val2)
//     // }
//   } else if (prop === 'geoip') {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     merged = {}
//     merged.city = _merge('city', val1.city, val2.city)
//     merged.country = _merge('country', val1.country, val2.country)
//     merged.continent = _merge('continent', val1.continent, val2.continent)
//     merged.registeredCountry = _merge('registeredCountry', val1.registeredCountry, val2.registeredCountry)
//
//     merged.location = {}
//
//     Object.each(val1.location, function (val1_data, val1_prop) {
//       if (!merged.location[val1_prop]) merged.location[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.location[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.location, function (val2_data, val2_prop) {
//       if (!merged.location[val2_prop]) merged.location[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.location[val2_prop].count += val2_data.count
//     })
//
//     merged.ip = {}
//
//     Object.each(val1.ip, function (val1_data, val1_prop) {
//       if (!merged.ip[val1_prop]) merged.ip[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.ip[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.ip, function (val2_data, val2_prop) {
//       if (!merged.ip[val2_prop]) merged.ip[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.ip[val2_prop].count += val2_data.count
//     })
//   } else {
//     debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   }
//   return merged
// }

// const _merge_objects = function (prop, val1, val2) {
//   let merged = {}
//   let _used_props = []
//   Object.each(val1, function (val1_data, val1_prop) {
//     if (val2 && val2[val1_prop]) {
//       merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
//     } else {
//       merged[val1_prop] = val1_data
//     }
//     _used_props.push(val1_prop)
//   })
//
//   Object.each(val2, function (val2_data, val2_prop) {
//     if (!_used_props.contains(val2_prop)) {
//       if (val1 && val1[val2_prop]) {
//         merged[val2_prop] = _merge(prop, val2_data, val1[val2_prop])
//       } else {
//         merged[val2_prop] = val2_data
//       }
//     }
//   })
//   return merged
// }

const generic_callback = function (data, metadata, key, vm) {
  // debug('HOST CALLBACK data %s %o', key, data)

  const END = end()
  // const END = 1586055600972 //= > test data
  // const END = Date.now() // production

  if (/periodical/.test(key) && data) { // (data.logs || Object.getLength(data) > 0)
    // const START = END - MINUTE
    // const START = END - (15 * SECOND)
    const START = (END - (15 * SECOND) >= 0) ? END - (15 * SECOND) : 0

    let _data
    if (data.logs) _data = data.logs // comes from 'Range'
    else _data = data // comes from 'register'

    if (!_data.data) _data.data = {}

    debug('PERIODICAL HOST CALLBACK _data %o', _data)

    /**
    * logs - format: stat
    let logs = []
    let log_template = _data[0].metadata
    Array.each(_data[0].data.log, function (row) {
      logs.push(Object.merge(Object.clone(log_template), { log: row.value, timestamp: row.timestamp }))
    })
    **/

    let timestamp = _data[0].metadata.timestamp
    /**
    * logs
    **/
    let logs = []
    let cgi_count = {}
    // let domain_count = {}
    // let host_count = {}

    let duration = []
    let duration_stats_template = { max: { domain: undefined, cgi: undefined, seconds: undefined }, min: { domain: undefined, cgi: undefined, seconds: undefined } }
    let duration_stats = Object.clone(duration_stats_template)
    // let log_template = _data[0].metadata
    let per_domain = {}
    let per_host = {}

    let err_count = 0

    Array.each(_data, function (row) {
      logs.push(Object.merge(Object.clone(row.metadata), { log: row.data.log }))
      if (!cgi_count[row.data.cgi]) cgi_count[row.data.cgi] = 0
      cgi_count[row.data.cgi]++

      // if (!domain_count[row.metadata.domain]) domain_count[row.metadata.domain] = 0
      // domain_count[row.metadata.domain]++

      if (!per_domain[row.metadata.domain]) per_domain[row.metadata.domain] = Object.merge(Object.clone(duration_stats_template), { count: 0, duration: [] })
      if (!per_host[row.metadata.host]) per_host[row.metadata.host] = Object.merge(Object.clone(duration_stats_template), { count: 0, duration: [] })

      let cgi_duration = ((row.data.duration / NANOSECOND).toFixed(2)) * 1
      duration.push(cgi_duration)

      per_domain[row.metadata.domain].duration.push(cgi_duration)
      per_domain[row.metadata.domain].count++

      per_host[row.metadata.host].duration.push(cgi_duration)
      per_host[row.metadata.host].count++

      // per_domain[row.metadata.domain].domain = row.metadata.domain
      // if (cgi_duration < 0) { // ERROR
      //   // debug('NEGATIVE DURATION ERR %O', row)
      //   // err_count++
      //   cgi_duration *= -1
      // }

      if (duration_stats.max.seconds === undefined || duration_stats.max.seconds < cgi_duration) {
        duration_stats.max.seconds = cgi_duration
        duration_stats.max.cgi = row.data.cgi
        duration_stats.max.domain = row.metadata.domain
      }

      if (duration_stats.min.seconds === undefined || duration_stats.min.seconds > cgi_duration) {
        duration_stats.min.seconds = cgi_duration
        duration_stats.min.cgi = row.data.cgi
        duration_stats.min.domain = row.metadata.domain
      }

      if (per_domain[row.metadata.domain].max.seconds === undefined || per_domain[row.metadata.domain].max.seconds < cgi_duration) {
        per_domain[row.metadata.domain].max.seconds = cgi_duration
        per_domain[row.metadata.domain].max.cgi = row.data.cgi
        // per_domain[row.metadata.domain].max.domain = row.metadata.domain
      }

      if (per_domain[row.metadata.domain].min.seconds === undefined || per_domain[row.metadata.domain].min.seconds > cgi_duration) {
        per_domain[row.metadata.domain].min.seconds = cgi_duration
        per_domain[row.metadata.domain].min.cgi = row.data.cgi
        // per_domain[row.metadata.domain].min.domain = row.metadata.domain
      }

      if (per_host[row.metadata.host].max.seconds === undefined || per_host[row.metadata.host].max.seconds < cgi_duration) {
        per_host[row.metadata.host].max.seconds = cgi_duration
        per_host[row.metadata.host].max.cgi = row.data.cgi
        // per_host[row.metadata.host].max.host = row.metadata.host
      }

      if (per_host[row.metadata.host].min.seconds === undefined || per_host[row.metadata.host].min.seconds > cgi_duration) {
        per_host[row.metadata.host].min.seconds = cgi_duration
        per_host[row.metadata.host].min.cgi = row.data.cgi
        // per_host[row.metadata.host].min.host = row.metadata.host
      }
    })

    duration_stats = Object.merge(duration_stats, {
      sum: ss.sum(duration),
      avg: ss.mean(duration).toFixed(2) * 1,
      median: ss.median(duration).toFixed(2) * 1
    })

    Object.each(per_domain, function (val, domain) {
      per_domain[domain] = Object.merge(val, {
        sum: ss.sum(val.duration),
        avg: ss.mean(val.duration).toFixed(2) * 1,
        median: ss.median(val.duration).toFixed(2) * 1
      })
    })

    Object.each(per_host, function (val, host) {
      per_host[host] = Object.merge(val, {
        sum: ss.sum(val.duration),
        avg: ss.mean(val.duration).toFixed(2) * 1,
        median: ss.median(val.duration).toFixed(2) * 1
      })
    })

    // debug('TOTAL %d', _data.length)
    // debug('TOTAL ERR %d', err_count)
    debug('DURATION %o', duration_stats)

    if (logs.length > 0) {
      // vm.logs = logs
      vm.$set(vm.periodical, 'logs', logs)
      vm.loading_logs = false
    }

    vm.$set(vm.periodical, 'cgi_count', cgi_count)
    vm.$set(vm.periodical, 'duration_stats', duration_stats)
    vm.$set(vm.periodical, 'per_domain', per_domain)
    vm.$set(vm.periodical, 'per_host', per_host)
    vm.$set(vm.periodical, 'timestamp', timestamp)
  }
  // else if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
  //   debug('HISTORICAL HOST CALLBACK data %s %o', key, data)
  //
  // }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'historical.minute.once', 'historical.hour.once', 'historical.day.once']// 'config.once',
      key = ['periodical.once']// 'config.once',
    }

    if (
      _key
    ) {
      // const END = 1586055600972 //= > test data
      const END = end()

      /**
      * production
      **/
      // const END = Date.now()

      let START

      let filter = "this.r.row('metadata')('path').eq('logs.educativa').and("

      Object.each(vm.filter, function (value, prop) {
        filter += "this.r.row('metadata')('" + prop + "').eq('" + value + "').and("
      })

      debug('FILTER STRING %s', filter)

      switch (_key) {
        case 'periodical.once':
          // START = END - MINUTE
          // START = END - (15 * SECOND)
          START = (END - (15 * SECOND) >= 0) ? END - (15 * SECOND) : 0

          filter += "this.r.row('metadata')('type').eq('periodical')"
          Object.each(vm.filter, function (value, prop) {
            filter += ')'
          })

          filter += ')' // "this.r.row('metadata')('path').eq('logs.educativa').and("

          debug('FILTER STRING %s', filter)

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs',
              // 'register': 'changes',
              // 'format': 'stat',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
                // { 'limit': 10 }
              ],
              filter: filter
              // 'filter': [
              //   { 'metadata': vm.filter },
              //   "r.row('metadata')('type').eq('periodical')"
              // ]

            }
          }]
          break

        // case 'historical.minute.once':
        //   // START = END - MINUTE
        //   START = (END - (2 * MINUTE) >= 0) ? END - (2 * MINUTE) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('minute')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> "this.r.row('metadata')('path').eq('logs.educativa').and("
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       // 'format': 'stat',
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
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('minute')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
        //
        // case 'historical.hour.once':
        //   // START = END - HOUR
        //   START = (END - (2 * HOUR) >= 0) ? END - (2 * HOUR) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('hour')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> "this.r.row('metadata')('path').eq('logs.educativa').and("
        //
        //   debug('FILTER STRING HOUR %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       // 'format': 'stat',
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
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
        //
        // case 'historical.day.once':
        //   // START = END - DAY
        //   START = (END - DAY >= 0) ? END - DAY : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('day')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> "this.r.row('metadata')('path').eq('logs.educativa').and("
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       'format': 'stat',
        //       'index': false,
        //       /**
        //         * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //         **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
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
  callback: generic_callback

}

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  // host_range_component
  host_once_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
