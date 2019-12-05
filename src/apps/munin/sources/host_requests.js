import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:host_requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const generic_callback = function (data, metadata, key, vm) {
  if (/periodical/.test(key) && data.munin) {
    // Object.each(data.munin, function (plugin, name) {
    //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
    //   vm.$set(vm.plugins[name], 'periodical', plugin)
    //
    //   debug('PERIODICAL HOST CALLBACK %o ', JSON.parse(JSON.stringify(vm.plugins)))
    // })

    Object.each(data.munin, function (plugin, name) {
      // debug('PERIODICAL HOST CALLBACK data %s %o', name, plugin)

      if (plugin && Object.getLength(plugin) > 0) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })

        vm.$nextTick(function () {
          if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
            if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

            let _plugin = {}
            if (
              vm.$refs[name][0].$options.plugin_data &&
              vm.$refs[name][0].$options.plugin_data.periodical &&
                Object.getLength(vm.$refs[name][0].$options.plugin_data.periodical) > 0
            ) {
              _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))

              Object.each(plugin, function (data, prop) {
                if (_plugin[prop] && Array.isArray(_plugin[prop])) {
                  _plugin[prop].combine(data)

                  // sort by first column, timestamp
                  _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })

                  // filter based on not repeated timestamp
                  // let filtered = _plugin[prop].filter(function (item, index) {
                  //   debug('PERIODICAL HOST CALLBACK %s %o', name, item, index, _plugin[prop][index - 1])
                  //   // if (!_plugin[prop][index - 1] || !_plugin[prop][index + 1]) {
                  //   //   return true
                  //   // } else if (_plugin[prop][index - 1] && !_plugin[prop][index + 1]) {
                  //   //   return item[0] !== _plugin[prop][index - 1][0]
                  //   // } else if (!_plugin[prop][index - 1] && _plugin[prop][index + 1]) {
                  //   //   return item[0] !== _plugin[prop][index + 1][0]
                  //   // } else {
                  //   //   return item[0] !== _plugin[prop][index - 1][0] && item[0] !== _plugin[prop][index + 1][0]
                  //   // }
                  //   return true
                  // })
                  let filtered = []
                  Array.each(_plugin[prop], function (item, index) {
                    if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
                      filtered.push(item)
                    }
                  })

                  // debug('PERIODICAL HOST CALLBACK %s %o', name, prop, filtered)

                  _plugin[prop] = filtered
                } else {
                  debug('PERIODICAL HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
                  // _plugin[prop] = data
                  //
                  // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
                }
              })

              debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
            } else {
              _plugin = plugin
              Object.each(_plugin, function (data, prop) {
                // sort by first column, timestamp
                _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
              })

              debug('PERIODICAL HOST CALLBACK no prev data %s %o %o', name, _plugin)
            }

            if (Object.getLength(_plugin) > 0) { vm.$refs[name][0].set_data({ periodical: _plugin }) }
          }
        })
      }
    })
  } else if (/minute/.test(key) && data.munin_historical) {
    // debug('MINUTE HOST ONCE CALLBACK %o ', JSON.parse(JSON.stringify(data.munin_historical)))

    // Object.each(data.munin_historical, function (plugin, name) {
    //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
    //
    //   vm.$set(vm.plugins[name], 'minute', plugin)
    // })
    Object.each(data.munin_historical, function (plugin, name) {
      if (plugin && Object.getLength(plugin) > 0) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })

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
                _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
              })
            }

            if (Object.getLength(_plugin) > 0) { vm.$refs[name][0].set_data({ minute: _plugin }) }
          }
        })
      }
    })
  } else if (key === 'config.once' && data.munin) {
    let _plugins_config = {}
    let _plugins_config_sorted = []
    Array.each(data.munin, function (group_path) {
      // debug('PERIODICAL HOST CALLBACK %o %o %s', group_path)
      let config = group_path[0].config // only one per path
      let category = (config && config.graph && config.graph.category) ? config.graph.category : 'uncategorized'
      let path = group_path[0].metadata.path

      if (!_plugins_config[category]) _plugins_config[category] = {}
      if (!_plugins_config_sorted.contains(category)) _plugins_config_sorted.push(category)

      _plugins_config[category][path] = config
    })

    _plugins_config_sorted.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
    let plugins_config = {}
    for (let i = 0; i < _plugins_config_sorted.length; i++) {
      let category = _plugins_config_sorted[i]
      plugins_config[category] = _plugins_config[category]
    }

    if (Object.getLength(plugins_config) > 0) {
      vm.plugins_config = plugins_config
    }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['periodical.once', 'config.once', 'minute.once']//
      // key = ['config.once']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

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
              'from': 'munin',
              // 'register': 'changes',
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
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': { 'metadata': { 'host': vm.host } }

            }
          }]
          break

        case 'config.once':
          source = [{
            params: { id: _key },
            range: 'posix ' + (Date.now() - 15 * SECOND) + '-' + Date.now() + '/*',
            path: 'all',
            // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'munin',
              // 'index': false,

              'q': [
                // 'id',
                'config',
                { 'metadata': ['path'] }
              ],
              // 'transformation': [
              //   { 'orderBy': { 'index': 'r.desc(timestamp)' } }
              //   // 'slice:0:1'
              // ],
              'aggregation': 'distinct',
              'filter': [{ 'metadata': { 'host': vm.host } }]
            }
          }]

          break
        case 'minute.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (12 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'munin_historical',
              // 'register': 'changes',
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
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'minute' } }
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
  // callback: function (data, metadata, key, vm) {
  //   if (/periodical/.test(key) && data.munin) {
  //     // Object.each(data.munin, function (plugin, name) {
  //     //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //     //   vm.$set(vm.plugins[name], 'periodical', plugin)
  //     //
  //     //   debug('PERIODICAL HOST CALLBACK %o ', JSON.parse(JSON.stringify(vm.plugins)))
  //     // })
  //
  //     Object.each(data.munin, function (plugin, name) {
  //       if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           if (
  //             vm.$refs[name][0].$options.plugin_data &&
  //             Array.isArray(vm.$refs[name][0].$options.plugin_data.periodical)
  //           ) {
  //             _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))
  //
  //             Object.each(plugin, function (data, prop) {
  //               _plugin[prop].combine(data)
  //
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           } else {
  //             _plugin = Object.clone(plugin)
  //             Object.each(_plugin, function (data, prop) {
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           }
  //
  //           vm.$refs[name][0].set_data({ periodical: _plugin })
  //         }
  //       })
  //     })
  //   } else if (/minute/.test(key) && data.munin_historical) {
  //     // debug('MINUTE HOST ONCE CALLBACK %o ', JSON.parse(JSON.stringify(data.munin_historical)))
  //
  //     // Object.each(data.munin_historical, function (plugin, name) {
  //     //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //     //
  //     //   vm.$set(vm.plugins[name], 'minute', plugin)
  //     // })
  //     Object.each(data.munin_historical, function (plugin, name) {
  //       if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           if (
  //             vm.$refs[name][0].$options.plugin_data &&
  //             Array.isArray(vm.$refs[name][0].$options.plugin_data.minute)
  //           ) {
  //             _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))
  //
  //             Object.each(plugin, function (data, prop) {
  //               _plugin[prop].combine(data)
  //
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           } else {
  //             _plugin = Object.clone(plugin)
  //             Object.each(_plugin, function (data, prop) {
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           }
  //
  //           vm.$refs[name][0].set_data({ minute: _plugin })
  //         }
  //       })
  //     })
  //   } else if (key === 'config.once' && data.munin) {
  //     let _plugins_config = {}
  //     let _plugins_config_sorted = []
  //     Array.each(data.munin, function (group_path) {
  //       // debug('PERIODICAL HOST CALLBACK %o %o %s', group_path)
  //       let config = group_path[0].config // only one per path
  //       let category = (config && config.graph && config.graph.category) ? config.graph.category : 'uncategorized'
  //       let path = group_path[0].metadata.path
  //
  //       if (!_plugins_config[category]) _plugins_config[category] = {}
  //       if (!_plugins_config_sorted.contains(category)) _plugins_config_sorted.push(category)
  //
  //       _plugins_config[category][path] = config
  //     })
  //
  //     _plugins_config_sorted.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //     let plugins_config = {}
  //     for (let i = 0; i < _plugins_config_sorted.length; i++) {
  //       let category = _plugins_config_sorted[i]
  //       plugins_config[category] = _plugins_config[category]
  //     }
  //
  //     if (Object.getLength(plugins_config) > 0) {
  //       vm.plugins_config = plugins_config
  //     }
  //   }
  // }
}

const host_range_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['periodical.range', 'config.range', 'minute.range']
      key = ['periodical.range', 'minute.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.range':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (15 * SECOND)) + '-' + Date.now() + '/*',
            query: {
              'from': 'munin',
              // 'register': 'changes',
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
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': { 'metadata': { 'host': vm.host } }

            }
          }]
          break

        case 'minute.range':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            query: {
              'from': 'munin_historical',
              // 'register': 'changes',
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
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'minute' } }
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
  // callback: function (data, metadata, key, vm) {
  //   // debug('PERIODICAL HOST CALLBACK %o %o %s', data, metadata, key)
  //
  //   if (key === 'periodical.range' && data.munin) {
  //     Object.each(data.munin, function (plugin, name) {
  //       if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           if (
  //             vm.$refs[name][0].$options.plugin_data &&
  //             Array.isArray(vm.$refs[name][0].$options.plugin_data.periodical)
  //           ) {
  //             _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))
  //
  //             Object.each(plugin, function (data, prop) {
  //               _plugin[prop].combine(data)
  //
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           } else {
  //             _plugin = Object.clone(plugin)
  //             Object.each(_plugin, function (data, prop) {
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           }
  //
  //           vm.$refs[name][0].set_data({ periodical: _plugin })
  //         }
  //       })
  //     })
  //   } else if (key === 'minute.range' && data.munin_historical) {
  //     Object.each(data.munin_historical, function (plugin, name) {
  //       if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name] && vm.$refs[name][0]) { // if data already exists
  //           if (!vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           if (
  //             vm.$refs[name][0].$options.plugin_data &&
  //             Array.isArray(vm.$refs[name][0].$options.plugin_data.minute)
  //           ) {
  //             _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))
  //
  //             Object.each(plugin, function (data, prop) {
  //               _plugin[prop].combine(data)
  //
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           } else {
  //             _plugin = Object.clone(plugin)
  //             Object.each(_plugin, function (data, prop) {
  //               // sort by first column, timestamp
  //               _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //             })
  //           }
  //
  //           vm.$refs[name][0].set_data({ minute: _plugin })
  //         }
  //       })
  //     })
  //   }
  //   // else if (key === 'config.range' && data.munin) {
  //   //   let _plugins_config = {}
  //   //   let _plugins_config_sorted = []
  //   //   Array.each(data.munin, function (group_path) {
  //   //     // debug('PERIODICAL HOST CALLBACK %o %o %s', group_path)
  //   //     let config = group_path[0].config // only one per path
  //   //     let category = (config && config.graph && config.graph.category) ? config.graph.category : 'uncategorized'
  //   //     let path = group_path[0].metadata.path
  //   //
  //   //     if (!_plugins_config[category]) _plugins_config[category] = {}
  //   //     if (!_plugins_config_sorted.contains(category)) _plugins_config_sorted.push(category)
  //   //
  //   //     _plugins_config[category][path] = config
  //   //   })
  //   //
  //   //   _plugins_config_sorted.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //   //   let plugins_config = {}
  //   //   for (let i = 0; i < _plugins_config_sorted.length; i++) {
  //   //     let category = _plugins_config_sorted[i]
  //   //     plugins_config[category] = _plugins_config[category]
  //   //   }
  //   //
  //   //   if (Object.getLength(plugins_config) > 0) {
  //   //     vm.plugins_config = plugins_config
  //   //   }
  //   // }
  // }
}

const once = [
  host_once_component
]

const periodical = [
  host_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, host_range_component }
export default requests
