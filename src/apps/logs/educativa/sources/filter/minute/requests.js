import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:sources:filter:minute:requests')

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

  if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
    // debug('HISTORICAL HOST CALLBACK data %s %o', key, data)
    // let type
    // let vm_data = {}
    let per_domain = {}
    let per_host = {}

    Array.each(data.logs_historical, function (row) {
      if (row.metadata.domain) {
        let domain = row.metadata.domain
        if (!per_domain[domain]) per_domain[domain] = row.data
      } else {
        let host = row.metadata.host
        if (!per_host[host]) per_host[host] = row.data
      }
      // if (!type) type = row.metadata.type
      // Object.each(row.data, function (row_data, prop) {
      //   if (!vm_data[prop]) {
      //     vm_data[prop] = JSON.parse(JSON.stringify(row_data[0].value))
      //   } else if (row_data[0] && row_data[0].value) {
      //     // if (prop === 'user_agent') {
      //     //   // debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop, vm_data[prop], row_data)
      //     //   debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop)
      //     //   vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // }
      //     vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, prop, row_data)
      //   }
      // })
      //
      // if (Object.getLength(vm_data) > 0) {
      //   vm[type] = vm_data
      // }
    })

    debug('HISTORICAL HOST CALLBACK data %s %o %o', key, per_domain, per_host)
    vm.$set(vm.minute, 'per_domain', per_domain)
    vm.$set(vm.minute, 'per_host', per_host)
    // // data = data.logs_historical[0]
    //
    // // if (/minute/.test(key)){
    // //   const START = END - MINUTE
    // // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'historical.minute.once', 'historical.hour.once', 'historical.day.once']// 'config.once',
      key = ['historical.minute.once']// 'config.once',
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
        // case 'periodical.once':
        //   // START = END - MINUTE
        //   // START = END - (15 * SECOND)
        //   START = (END - (15 * SECOND) >= 0) ? END - (15 * SECOND) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('periodical')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // "this.r.row('metadata')('path').eq('logs.educativa').and("
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs',
        //       // 'register': 'changes',
        //       // 'format': 'stat',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //         // { 'limit': 10 }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('periodical')"
        //       // ]
        //
        //     }
        //   }]
        //   break

        case 'historical.minute.once':
          // START = END - MINUTE
          START = (END - (3 * MINUTE) >= 0) ? END - (3 * MINUTE) : 0

          filter += "this.r.row('metadata')('type').eq('minute')"
          Object.each(vm.filter, function (value, prop) {
            filter += ')'
          })

          filter += ')' // -> "this.r.row('metadata')('path').eq('logs.educativa').and("

          debug('FILTER STRING %s', filter)

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs_historical',
              // 'register': 'changes',
              // 'format': 'stat',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // {
                //   'metadata': [
                //     'timestamp',
                //     'path'
                //   ]
                // },
                'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              filter: filter
              // 'filter': [
              //   { 'metadata': vm.filter },
              //   "r.row('metadata')('type').eq('minute')"
              // ]

            }
          }]

          break

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

    debug('MyChart periodical KEY ', key, source)

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
