import * as Debug from 'debug'
const debug = Debug('apps:logs:sources:webs:filter:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

let total_bytes_sent = {}
let user_agent_os_counter = {}
let user_agent_os_family_counter = {}
let user_agent_engine_counter = {}
let user_agent_browser_counter = {}

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL HOST CALLBACK data %s %o', key, data)

  const END = 1557246080000 // test data
  // const END = Date.now() //production

  if (/periodical/.test(key) && (data.logs || Object.getLength(data) > 0)) {
    const START = END - MINUTE

    let _data
    if (data.logs) _data = data.logs // comes from 'Range'
    else _data = data // comes from 'register'

    debug('PERIODICAL HOST CALLBACK _data %o', _data)

    let logs = []

    let current_bytes_sent = 0

    let log_template = _data[0].metadata
    Array.each(_data[0].data.log, function (row) {
      logs.push(Object.merge(Object.clone(log_template), { log: row.value, timestamp: row.timestamp }))
    })

    Array.each(_data[0].data.body_bytes_sent, function (row, index) {
      if (index === 0) {
        current_bytes_sent = row.value
      }
      // logs.push(Object.merge(Object.clone(log_template), { log: row.value, timestamp: row.timestamp }))
      total_bytes_sent[row.timestamp] = row.value
    })

    let periodical_total_bytes_sent = 0
    Object.each(total_bytes_sent, function (val, ts) {
      if (ts < START) {
        delete total_bytes_sent[ts]
      } else {
        periodical_total_bytes_sent += val
      }
    })

    Array.each(_data[0].data.user_agent, function (row, index) {
      // debug('OS %s', row.value.os.family)

      let os = row.value.os.family

      user_agent_os_family_counter[row.timestamp] = os

      os = (row.value.os.major) ? os + ' ' + row.value.os.major : os
      // os = (row.value.os.minor) ? os + '.' + row.value.os.minor : os
      user_agent_os_counter[row.timestamp] = os

      let engine = row.value.engine.family
      engine = (row.value.engine.major) ? engine + ' ' + row.value.engine.major : engine
      engine = (row.value.engine.minor) ? engine + '.' + row.value.engine.minor : engine
      engine = (row.value.engine.patch) ? engine + '.' + row.value.engine.patch : engine

      user_agent_engine_counter[row.timestamp] = engine

      let browser = row.value.ua.family
      browser = (row.value.ua.major) ? browser + ' ' + row.value.ua.major : browser
      browser = (row.value.ua.minor) ? browser + '.' + row.value.ua.minor : browser
      browser = (row.value.ua.patch) ? browser + '.' + row.value.ua.patch : browser

      user_agent_browser_counter[row.timestamp] = browser
    })

    let periodical_user_agent_os_counter = {}
    let periodical_user_agent_os_family_counter = {}
    let periodical_user_agent_engine_counter = {}
    let periodical_user_agent_browser_counter = {}

    Object.each(user_agent_os_counter, function (val, ts) {
      if (ts < START) {
        delete user_agent_os_counter[ts]
        delete user_agent_os_family_counter[ts]
      } else {
        let family = user_agent_os_family_counter[ts]
        let engine = user_agent_engine_counter[ts]
        let browser = user_agent_browser_counter[ts]

        if (!periodical_user_agent_os_counter[val]) periodical_user_agent_os_counter[val] = 0
        if (!periodical_user_agent_os_family_counter[family]) periodical_user_agent_os_family_counter[family] = 0
        if (!periodical_user_agent_engine_counter[engine]) periodical_user_agent_engine_counter[engine] = 0
        if (!periodical_user_agent_browser_counter[browser]) periodical_user_agent_browser_counter[browser] = 0

        periodical_user_agent_os_counter[val] += 1
        periodical_user_agent_os_family_counter[family] += 1
        periodical_user_agent_engine_counter[engine] += 1
        periodical_user_agent_browser_counter[browser] += 1
      }
    })

    if (logs.length > 0) { vm.logs = logs; vm.loading_logs = false }

    vm.$set(vm.periodical, 'total_bytes_sent', periodical_total_bytes_sent)
    vm.$set(vm.periodical, 'user_agent_os_counter', periodical_user_agent_os_counter)
    vm.$set(vm.periodical, 'user_agent_os_family_counter', periodical_user_agent_os_family_counter)
    vm.$set(vm.periodical, 'user_agent_engine_counter', periodical_user_agent_engine_counter)
    vm.$set(vm.periodical, 'user_agent_browser_counter', periodical_user_agent_browser_counter)
    vm.$set(vm.periodical, 'current_bytes_sent', current_bytes_sent)
  }

  // if (/periodical/.test(key) && (data.os || Object.getLength(data) > 0)) {
  //   let _data
  //   if (data.os) _data = data.os // comes from 'Range'
  //   else _data = data // comes from 'register'
  //
  //   // let _paths = []
  //   // let _plugins_categories = []
  //   // let _plugins_config_sorted = []
  //
  //   Object.each(_data, function (plugin, name) {
  //     // name = name.toLowerCase()
  //     let category
  //     if (name !== undefined) {
  //       name = name.replace('os.', '')
  //       category = (name.indexOf('.') > -1) ? name.substring(0, name.indexOf('.')) : name
  //       // if (!_paths.contains(path)) _paths.push(path)
  //       // if (!_plugins_config[category]) _plugins_config[category] = {}
  //       if (!vm.plugins_categories.contains(category)) vm.plugins_categories.push(category)
  //
  //       // _plugins_config[category][name] = config
  //     }
  //
  //     if (plugin && Object.getLength(plugin) > 0) {
  //       // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //       if (!vm.plugins.contains(name)) vm.plugins.push(name)
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           // if (
  //           //   vm.$refs[name][0].$options.plugin_data &&
  //           //   vm.$refs[name][0].$options.plugin_data.periodical &&
  //           //     Object.getLength(vm.$refs[name][0].$options.plugin_data.periodical) > 0
  //           // ) {
  //           //   _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))
  //           //
  //           //   Object.each(plugin, function (data, prop) {
  //           //     if (_plugin[prop] && Array.isArray(_plugin[prop]) && _plugin[prop].length > 0) {
  //           //       _plugin[prop].combine(data)
  //           //
  //           //       // sort by first column, timestamp
  //           //       _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //
  //           //       let filtered = []
  //           //       Array.each(_plugin[prop], function (item, index) {
  //           //         if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
  //           //           filtered.push(item)
  //           //         }
  //           //       })
  //           //
  //           //       // debug('PERIODICAL HOST CALLBACK %s %o', name, prop, filtered)
  //           //
  //           //       _plugin[prop] = filtered
  //           //     } else {
  //           //       debug('PERIODICAL HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
  //           //       // _plugin[prop] = data
  //           //       //
  //           //       // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //     }
  //           //   })
  //           //
  //           //   // debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
  //           // } else {
  //           //   _plugin = {}
  //
  //           // Object.each(plugin, function (data, prop) {
  //           //   // sort by first column, timestamp
  //           //
  //           //   if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
  //           //     _plugin[prop] = Array.clone(data)
  //           //     _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //   }
  //           // })
  //
  //           Object.keys(plugin)
  //             .sort()// sort keys alphabetically
  //             .forEach(function (prop, i) {
  //             // console.log(v, data[v]);
  //               let data = plugin[prop]
  //               if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
  //                 _plugin[prop] = Array.clone(data)
  //                 _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //               }
  //             })
  //
  //           // debug('PERIODICAL HOST CALLBACK no prev data %s %o %o', name, _plugin)
  //           // }
  //
  //           if (Object.getLength(_plugin) > 0) {
  //             debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
  //             vm.$refs[name][0].set_data({ periodical: _plugin })
  //           }
  //         }
  //       })
  //     }
  //   })
  //
  //   vm.plugins_categories.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //   vm.plugins.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //
  //   // if (_plugins_categories.length > 0 && _plugins_categories.length !== vm.plugins_categories.length) {
  //   //   vm.plugins_categories = _plugins_categories
  //   // }
  // } else if (/minute/.test(key) && (data.os_historical || Object.getLength(data) > 0)) {
  //   let _data
  //   if (data.os_historical) _data = data.os_historical // comes from 'Range'
  //   else _data = data // comes from 'register'
  //
  //   debug('MINUTE HOST CALLBACK data %s %o', key, _data)
  //
  //   Object.each(data.os_historical, function (plugin, name) {
  //     if (plugin && Object.getLength(plugin) > 0) {
  //       // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //       if (!vm.plugins.contains(name)) vm.plugins.push(name)
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           if (
  //             vm.$refs[name][0].$options.plugin_data &&
  //             vm.$refs[name][0].$options.plugin_data.minute &&
  //             Object.getLength(vm.$refs[name][0].$options.plugin_data.minute) > 0
  //           ) {
  //             _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))
  //
  //             Object.each(plugin, function (data, prop) {
  //               if (_plugin[prop] && Array.isArray(_plugin[prop])) {
  //                 _plugin[prop].combine(data)
  //
  //                 // sort by first column, timestamp
  //                 _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //
  //                 // filter based on not repeated timestamp
  //                 // let filtered = _plugin[prop].filter(function (item, index) {
  //                 //   if (!_plugin[prop][index - 1] || !_plugin[prop][index + 1]) {
  //                 //     return true
  //                 //   } else {
  //                 //     return item[0] !== _plugin[prop][index - 1][0] && item[0] !== _plugin[prop][index + 1][0]
  //                 //   }
  //                 // })
  //                 //
  //                 let filtered = []
  //                 Array.each(_plugin[prop], function (item, index) {
  //                   if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
  //                     filtered.push(item)
  //                   }
  //                 })
  //                 // debug('MINUTE HOST CALLBACK %s %o', name, filtered)
  //
  //                 _plugin[prop] = filtered
  //               } else {
  //                 debug('MINUTE HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
  //                 // _plugin[prop] = Array.clone(data)
  //                 // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //               }
  //             })
  //           } else {
  //             // debug('MINUTE HOST CALLBACK no prev data %o ', plugin)
  //             _plugin = plugin
  //             Object.each(_plugin, function (data, prop) {
  //               // sort by first column, timestamp
  //               if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
  //                 _plugin[prop] = Array.clone(data)
  //                 _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //               }
  //             })
  //           }
  //
  //           if (Object.getLength(_plugin) > 0) {
  //             debug('MINUTE HOST CALLBACK %s %o', name, _plugin)
  //
  //             vm.$refs[name][0].set_data({ minute: _plugin })
  //           }
  //         }
  //       })
  //     }
  //   })
  // }
  // // else if (key === 'config.once' && data.os) {
  // //   debug('PERIODICAL HOST CALLBACK CONFIG %o', data)
  // //   let _plugins_config = {}
  // //   let _plugins_config_sorted = []
  // //   Array.each(data.os, function (group_path) {
  // //     // debug('PERIODICAL HOST CALLBACK %o %o %s', group_path)
  // //     let config = group_path[0].config // only one per path
  // //     let category = (config && config.graph && config.graph.category) ? config.graph.category.toLowerCase() : 'uncategorized'
  // //     let path = group_path[0].metadata.path
  // //
  // //     if (!_plugins_config[category]) _plugins_config[category] = {}
  // //     if (!_plugins_config_sorted.contains(category)) _plugins_config_sorted.push(category)
  // //
  // //     _plugins_config[category][path] = config
  // //   })
  // //
  // //   _plugins_config_sorted.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  // //   let plugins_config = {}
  // //   for (let i = 0; i < _plugins_config_sorted.length; i++) {
  // //     let category = _plugins_config_sorted[i]
  // //     plugins_config[category] = _plugins_config[category]
  // //   }
  // //
  // //   if (Object.getLength(plugins_config) > 0) {
  // //     vm.plugins_config = plugins_config
  // //   }
  // // }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      key = ['periodical.once', 'minute.once', 'hour.once']// 'config.once',
      // key = ['periodical.once']// 'config.once',
    }

    if (
      _key
    ) {
      // const END = 1557266400000 + MINUTE //= > home test data
      const END = 1557246080000 //= > office test data

      /**
      * production
      **/
      // const END = Date.now()

      let START

      switch (_key) {
        case 'periodical.once':
          START = END - MINUTE

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs',
              // 'register': 'changes',
              'format': 'stat',
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
              'filter': [
                { 'metadata': vm.filter },
                "r.row('metadata')('type').eq('periodical')"
              ]

            }
          }]
          break

        case 'minute.once':
          START = END - HOUR

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs_historical',
              // 'register': 'changes',
              'format': 'stat',
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
              'filter': [
                { 'metadata': vm.filter },
                "r.row('metadata')('type').eq('minute')"
              ]

            }
          }]

          break

        case 'hour.once':
          START = END - (2 * HOUR)

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs_historical',
              // 'register': 'changes',
              'format': 'stat',
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
              'filter': [
                { 'metadata': vm.filter },
                "r.row('metadata')('type').eq('hour')"
              ]

            }
          }]

          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const host_once_register = {
  params: function (_key, vm) {
    // debug('REGISTER host_once_register %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['periodical.register', 'minute.register']// , 'config.once'
      // key = ['config.once']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.register':
          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (10 * MINUTE)) + '-' + Date.now() + '/*',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            query: {
              'from': 'os',
              'register': 'changes',
              'format': 'tabular',
              'index': false,
              'opts': { includeTypes: true, squash: false },
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
                // 'metadata',
                'id',
                'data'
                // { 'metadata': ['host'] }
              ],
              // 'transformation': [
              //   {
              //     'orderBy': { 'index': 'r.desc(timestamp)' }
              //   }
              // ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                "r.row('metadata')('path').ne('os.procs')"
              ]

            }
          }]
          break

        case 'minute.register':
          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (12 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'os_historical',
              'register': 'changes',
              'format': 'tabular',
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
                // 'metadata',
                'id',
                'data'
                // { 'metadata': ['host', 'type'] }
              ],
              // 'transformation': [
              //   {
              //     'orderBy': { 'index': 'r.desc(timestamp)' }
              //   }
              // ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'minute' } },
                "r.row('metadata')('path').ne('os.procs')"
              ]

            }
          }]

          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

// const host_range_component = {
//   params: function (_key, vm) {
//     // debug('PERIODICAL host_range_component %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['periodical.range', 'config.range', 'minute.range']
//       key = ['periodical.range', 'minute.range']
//     }
//
//     // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'periodical.range':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             range: 'posix ' + (Date.now() - (15 * SECOND)) + '-' + Date.now() + '/*',
//             query: {
//               'from': 'os',
//               // 'register': 'changes',
//               'format': 'tabular',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // {
//                 //   'metadata': [
//                 //     'timestamp',
//                 //     'path'
//                 //   ]
//                 // },
//                 // 'metadata',
//                 'data'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': { 'metadata': { 'host': vm.host } }
//
//             }
//           }]
//           break
//
//         case 'minute.range':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
//             query: {
//               'from': 'os_historical',
//               // 'register': 'changes',
//               'format': 'tabular',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // {
//                 //   'metadata': [
//                 //     'timestamp',
//                 //     'path'
//                 //   ]
//                 // },
//                 // 'metadata',
//                 'data'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': [
//                 { 'metadata': { 'host': vm.host } },
//                 { 'metadata': { 'type': 'minute' } }
//               ]
//
//             }
//           }]
//
//           break
//       }
//     }
//
//     // debug('MyChart periodical KEY ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  // host_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
