import * as Debug from 'debug'
const debug = Debug('apps:os:sources:category_requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL CATEGORY CALLBACK data %s %o', key, data, metadata)

  if (/periodical/.test(key) && ((data.os && data.os.length > 0) || Object.getLength(data) > 0)) {
    let _grouped_data
    if (data.os) _grouped_data = data.os // comes from 'Range'
    else _grouped_data = data // comes from 'register'

    // let _paths = []
    // let _plugins_hosts = []
    // let _plugins_config_sorted = []
    Array.each(_grouped_data, function (_host_data) {
      // debug('PERIODICAL CATEGORY CALLBACK data %s %o', key, _host_data)

      Object.each(_host_data, function (plugin_data) {
        // debug('PERIODICAL CATEGORY CALLBACK data %s %o', key, plugin_data)

        let plugin = plugin_data.data
        let name = plugin_data.metadata.host + '.' + plugin_data.metadata.path
        let host = plugin_data.metadata.host

        // debug('PERIODICAL CATEGORY CALLBACK data %s %o', name, plugin)

        let category
        if (host !== undefined) {
          // name = name.replace('os.', '')
          // category = (host.indexOf('.') > -1) ? name.substring(0, name.indexOf('.')) : name
          // if (!_paths.contains(path)) _paths.push(path)
          // if (!_plugins_config[category]) _plugins_config[category] = {}
          if (!vm.plugins_hosts.contains(host)) vm.plugins_hosts.push(host)

          // _plugins_config[category][name] = config
        }

        if (plugin && Object.getLength(plugin) > 0) {
          // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
          if (!vm.plugins.contains(name)) vm.plugins.push(name)

          vm.$nextTick(function () {
            if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
              if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

              let _plugin = {}

              Object.keys(plugin)
                .sort()// sort keys alphabetically
                .forEach(function (prop, i) {
                // console.log(v, data[v]);
                  let data = plugin[prop]
                  if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
                    _plugin[prop] = Array.clone(data)
                    _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
                  }
                })

              // debug('PERIODICAL HOST CALLBACK no prev data %s %o %o', name, _plugin)
              // }

              if (Object.getLength(_plugin) > 0) {
                debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
                vm.$refs[name][0].set_data({ periodical: _plugin })
              }
            }
          })
        }
      })
    })
    // Object.each(_data, function (plugin, name) {
    //   // name = name.toLowerCase()
    //   let category
    //   if (name !== undefined) {
    //     name = name.replace('os.', '')
    //     category = (name.indexOf('.') > -1) ? name.substring(0, name.indexOf('.')) : name
    //     // if (!_paths.contains(path)) _paths.push(path)
    //     // if (!_plugins_config[category]) _plugins_config[category] = {}
    //     if (!vm.plugins_hosts.contains(category)) vm.plugins_hosts.push(category)
    //
    //     // _plugins_config[category][name] = config
    //   }
    //
    //   if (plugin && Object.getLength(plugin) > 0) {
    //     // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
    //     if (!vm.plugins.contains(name)) vm.plugins.push(name)
    //
    //     vm.$nextTick(function () {
    //       if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
    //         if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
    //
    //         let _plugin = {}
    //         // if (
    //         //   vm.$refs[name][0].$options.plugin_data &&
    //         //   vm.$refs[name][0].$options.plugin_data.periodical &&
    //         //     Object.getLength(vm.$refs[name][0].$options.plugin_data.periodical) > 0
    //         // ) {
    //         //   _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))
    //         //
    //         //   Object.each(plugin, function (data, prop) {
    //         //     if (_plugin[prop] && Array.isArray(_plugin[prop]) && _plugin[prop].length > 0) {
    //         //       _plugin[prop].combine(data)
    //         //
    //         //       // sort by first column, timestamp
    //         //       _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
    //         //
    //         //       let filtered = []
    //         //       Array.each(_plugin[prop], function (item, index) {
    //         //         if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
    //         //           filtered.push(item)
    //         //         }
    //         //       })
    //         //
    //         //       // debug('PERIODICAL HOST CALLBACK %s %o', name, prop, filtered)
    //         //
    //         //       _plugin[prop] = filtered
    //         //     } else {
    //         //       debug('PERIODICAL HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
    //         //       // _plugin[prop] = data
    //         //       //
    //         //       // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
    //         //     }
    //         //   })
    //         //
    //         //   // debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
    //         // } else {
    //         //   _plugin = {}
    //
    //         // Object.each(plugin, function (data, prop) {
    //         //   // sort by first column, timestamp
    //         //
    //         //   if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
    //         //     _plugin[prop] = Array.clone(data)
    //         //     _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
    //         //   }
    //         // })
    //
    //         Object.keys(plugin)
    //           .sort()// sort keys alphabetically
    //           .forEach(function (prop, i) {
    //           // console.log(v, data[v]);
    //             let data = plugin[prop]
    //             if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
    //               _plugin[prop] = Array.clone(data)
    //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
    //             }
    //           })
    //
    //         // debug('PERIODICAL HOST CALLBACK no prev data %s %o %o', name, _plugin)
    //         // }
    //
    //         if (Object.getLength(_plugin) > 0) {
    //           debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
    //           vm.$refs[name][0].set_data({ periodical: _plugin })
    //         }
    //       }
    //     })
    //   }
    // })

    vm.plugins_hosts.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
    vm.plugins.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })

    // if (_plugins_hosts.length > 0 && _plugins_hosts.length !== vm.plugins_hosts.length) {
    //   vm.plugins_hosts = _plugins_hosts
    // }
  } else if (/minute/.test(key) && (data.os_historical || Object.getLength(data) > 0)) {
    let _data
    if (data.os_historical) _data = data.os_historical // comes from 'Range'
    else _data = data // comes from 'register'

    debug('MINUTE HOST CALLBACK data %s %o', key, _data)

    Object.each(data.os_historical, function (plugin, name) {
      if (plugin && Object.getLength(plugin) > 0) {
        // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        if (!vm.plugins.contains(name)) vm.plugins.push(name)

        vm.$nextTick(function () {
          if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
            if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

            let _plugin = {}
            if (
              vm.$refs[name][0].$options.plugin_data &&
              vm.$refs[name][0].$options.plugin_data.minute &&
              Object.getLength(vm.$refs[name][0].$options.plugin_data.minute) > 0
            ) {
              _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))

              Object.each(plugin, function (data, prop) {
                if (_plugin[prop] && Array.isArray(_plugin[prop])) {
                  _plugin[prop].combine(data)

                  // sort by first column, timestamp
                  _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })

                  // filter based on not repeated timestamp
                  // let filtered = _plugin[prop].filter(function (item, index) {
                  //   if (!_plugin[prop][index - 1] || !_plugin[prop][index + 1]) {
                  //     return true
                  //   } else {
                  //     return item[0] !== _plugin[prop][index - 1][0] && item[0] !== _plugin[prop][index + 1][0]
                  //   }
                  // })
                  //
                  let filtered = []
                  Array.each(_plugin[prop], function (item, index) {
                    if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
                      filtered.push(item)
                    }
                  })
                  // debug('MINUTE HOST CALLBACK %s %o', name, filtered)

                  _plugin[prop] = filtered
                } else {
                  debug('MINUTE HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
                  // _plugin[prop] = Array.clone(data)
                  // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
                }
              })
            } else {
              // debug('MINUTE HOST CALLBACK no prev data %o ', plugin)
              _plugin = plugin
              Object.each(_plugin, function (data, prop) {
                // sort by first column, timestamp
                if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
                  _plugin[prop] = Array.clone(data)
                  _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
                }
              })
            }

            if (Object.getLength(_plugin) > 0) {
              debug('MINUTE HOST CALLBACK %s %o', name, _plugin)

              vm.$refs[name][0].set_data({ minute: _plugin })
            }
          }
        })
      }
    })
  }
  // else if (key === 'config.once' && data.os) {
  //   debug('PERIODICAL HOST CALLBACK CONFIG %o', data)
  //   let _plugins_config = {}
  //   let _plugins_config_sorted = []
  //   Array.each(data.os, function (group_path) {
  //     // debug('PERIODICAL HOST CALLBACK %o %o %s', group_path)
  //     let config = group_path[0].config // only one per path
  //     let category = (config && config.graph && config.graph.category) ? config.graph.category.toLowerCase() : 'uncategorized'
  //     let path = group_path[0].metadata.path
  //
  //     if (!_plugins_config[category]) _plugins_config[category] = {}
  //     if (!_plugins_config_sorted.contains(category)) _plugins_config_sorted.push(category)
  //
  //     _plugins_config[category][path] = config
  //   })
  //
  //   _plugins_config_sorted.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //   let plugins_config = {}
  //   for (let i = 0; i < _plugins_config_sorted.length; i++) {
  //     let category = _plugins_config_sorted[i]
  //     plugins_config[category] = _plugins_config[category]
  //   }
  //
  //   if (Object.getLength(plugins_config) > 0) {
  //     vm.plugins_config = plugins_config
  //   }
  // }
}

const category_once_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL category_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['periodical.once']// 'config.once', , 'minute.once'
    }

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            query: {
              'from': 'os',
              // 'register': 'changes',
              'format': 'tabular',
              'index': 'host',
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                { 'metadata': ['host'] }
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                "r.row('metadata')('path').ge('os." + vm.category + "')",
                "r.row('metadata')('path').lt('os." + vm.category + "\uFFFF')"
                // { 'metadata': { 'host': vm.host } },
                // "r.row('metadata')('path').ne('os.procs')"
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
        //       'filter': [{ 'metadata': { 'category': vm.host } }]
        //     }
        //   }]
        //
        //   break
        case 'minute.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'os_historical',
              // 'register': 'changes',
              // 'format': 'tabular',
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
                'data',
                { 'metadata': ['host'] }
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
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

const category_once_register = {
  params: function (_key, vm) {
    // debug('REGISTER category_once_register %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['periodical.register']// , 'config.once' , 'minute.register'
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
              // 'group': 'host',
              // 'index': 'host',
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
                'data',
                { 'metadata': ['host'] }
              ],
              // 'transformation': [
              //   {
              //     'orderBy': { 'index': 'r.desc(timestamp)' }
              //   }
              // ],
              'filter': [
                "r.row('metadata')('path').ge('os." + vm.category + "')",
                "r.row('metadata')('path').lt('os." + vm.category + "\uFFFF')"
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

// const category_range_component = {
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
  category_once_register,
  category_once_component
]

const periodical = [
  // category_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
