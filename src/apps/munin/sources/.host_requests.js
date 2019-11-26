import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:host_requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

// const config_component_req = {
//
//   params: {
//     path: 'all',
//     // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
//     query: {
//       'from': 'munin',
//       'index': false,
//
//       'q': [
//         // 'id',
//         'config'
//       ],
//       'transformation': [
//         { 'orderBy': { 'index': 'r.desc(timestamp)' } },
//         'slice:0:1'
//       ],
//       'filter': [{ 'metadata': { 'host': undefined } }, { 'metadata': { 'path': undefined } }]
//     }
//
//   },
//   callback: function (data, metadata, key, vm) {
//     debug('CONFIG %o %o', data, metadata)
//     let host = metadata.filter[0].metadata.host
//     let name = metadata.filter[1].metadata.path
//     let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined
//
//     vm.$set(vm.plugins_config, name, config)
//   }
// }

const host_once_component = {
  params: function (_key, vm) {
    debug('ONCE host_range_component %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'config.once', 'minute.once']
      key = ['periodical.once', 'config.once']
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
            // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + (Date.now() - (15 * MINUTE)) + '-' + Date.now() + '/*',
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
                  'orderBy': { 'index': 'r.asc(timestamp)' }
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
            // range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + (Date.now() - (20 * MINUTE)) + '-' + Date.now() + '/*',
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
                  'orderBy': { 'index': 'r.asc(timestamp)' }
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

      // source = [{
      //   params: { id: _key },
      //   path: 'all',
      //   range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin',
      //     // 'register': 'changes',
      //     'format': 'tabular',
      //     'index': false,
      //     /**
      //     * right now needed to match OUTPUT 'id' with this query (need to @fix)
      //     **/
      //     'q': [
      //       // {
      //       //   'metadata': [
      //       //     'timestamp',
      //       //     'path'
      //       //   ]
      //       // },
      //       // 'metadata',
      //       'data'
      //     ],
      //     'transformation': [
      //       {
      //         'orderBy': { 'index': 'r.desc(timestamp)' }
      //       }
      //     ],
      //     'filter': { 'metadata': { 'host': vm.host } }
      //
      //   }
      // },
      // {
      //   params: { id: _key },
      //   range: 'posix ' + (Date.now() - 15 * SECOND) + '-' + Date.now() + '/*',
      //   path: 'all',
      //   // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin',
      //     // 'index': false,
      //
      //     'q': [
      //       // 'id',
      //       'config'
      //       // { 'metadata': ['path'] }
      //     ],
      //     // 'transformation': [
      //     //   { 'orderBy': { 'index': 'r.desc(timestamp)' } }
      //     //   // 'slice:0:1'
      //     // ],
      //     'aggregation': 'distinct',
      //     'filter': [{ 'metadata': { 'host': vm.host } }]
      //   }
      // },
      // {
      //   params: { id: _key },
      //   path: 'all',
      //   range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin_historical',
      //     // 'register': 'changes',
      //     'format': 'tabular',
      //     'index': false,
      //     /**
      //     * right now needed to match OUTPUT 'id' with this query (need to @fix)
      //     **/
      //     'q': [
      //       // {
      //       //   'metadata': [
      //       //     'timestamp',
      //       //     'path'
      //       //   ]
      //       // },
      //       // 'metadata',
      //       'data'
      //     ],
      //     'transformation': [
      //       {
      //         'orderBy': { 'index': 'r.desc(timestamp)' }
      //       }
      //     ],
      //     'filter': [
      //       { 'metadata': { 'host': vm.host } },
      //       { 'metadata': { 'type': 'minute' } }
      //     ]
      //
      //   }
      // }]
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    // debug('PERIODICAL HOST CALLBACK %o %o %s', data, metadata, key)

    if (key === 'periodical.once' && data.munin) {
      Object.each(data.munin, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        vm.$set(vm.plugins[name], 'periodical', plugin)

        debug('ONCE HOST CALLBACK %o ', JSON.parse(JSON.stringify(vm.plugins)))

      //   if (!vm.plugins_config[name]) {
      //     let config_comp_req = Object.clone(config_component_req)
      //
      //     // config_comp_req.params.query.filter[0].metadata.host = metadata.filter.metadata.host
      //     // config_comp_req.params.query.filter[1].metadata.path = name
      //     config_comp_req.host = metadata.filter.metadata.host
      //     config_comp_req.path = name
      //
      //     debug('CONFIG_COMP %o', config_comp_req)
      //     vm.$set(vm.components, name, {
      //       source: {
      //         requests: {
      //           once: [
      //             config_comp_req
      //           ]
      //         }
      //       }
      //     })
      //   }
      })
      //
      // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].options.requests.once = vm.__components_sources_to_requests(vm.components).once
      // // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnce')
      // vm.destroy_pipelines()
      // vm.create_pipelines()
    } else if (key === 'minute.once' && data.munin_historical) {
      Object.each(data.munin_historical, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        vm.$set(vm.plugins[name], 'minute', plugin)
      })
    } else if (key === 'config.once' && data.munin) {
      // Object.each(data.munin_historical, function (plugin, name) {
      //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
      //   vm.$set(vm.plugins[name], 'minute', plugin)
      // })
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
        // vm.$set(vm.plugins_config, path, config)

        // if (category && !vm.plugins_categories.contains(category)) {
        //   vm.plugins_categories.push(category)
        // }
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
      // let host = metadata.filter[0].metadata.host
      // let name = metadata.filter[1].metadata.path
      // let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined
      //
    }

    // vm.$set(vm.munin, data.munin)
    //
    // // Object.each(data., function (data, table) {
    // //   vm.$set(vm.munin, table, data)
    // // })
    //
    // vm.$set(vm.components, 'periodical', )
    // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
    // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
  }
}

const host_range_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm)

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
            range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            // range: 'posix ' + (Date.now() - HOUR) + '-' + Date.now() + '/*',
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
                  'orderBy': { 'index': 'r.asc(timestamp)' }
                }
              ],
              'filter': { 'metadata': { 'host': vm.host } }

            }
          }]
          break

        case 'config.range':
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
        case 'minute.range':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (20 * MINUTE)) + '-' + Date.now() + '/*',
            // range: 'posix ' + (Date.now() - (HOUR + MINUTE)) + '-' + Date.now() + '/*',
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
                  'orderBy': { 'index': 'r.asc(timestamp)' }
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

      // source = [{
      //   params: { id: _key },
      //   path: 'all',
      //   range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin',
      //     // 'register': 'changes',
      //     'format': 'tabular',
      //     'index': false,
      //     /**
      //     * right now needed to match OUTPUT 'id' with this query (need to @fix)
      //     **/
      //     'q': [
      //       // {
      //       //   'metadata': [
      //       //     'timestamp',
      //       //     'path'
      //       //   ]
      //       // },
      //       // 'metadata',
      //       'data'
      //     ],
      //     'transformation': [
      //       {
      //         'orderBy': { 'index': 'r.desc(timestamp)' }
      //       }
      //     ],
      //     'filter': { 'metadata': { 'host': vm.host } }
      //
      //   }
      // },
      // {
      //   params: { id: _key },
      //   range: 'posix ' + (Date.now() - 15 * SECOND) + '-' + Date.now() + '/*',
      //   path: 'all',
      //   // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin',
      //     // 'index': false,
      //
      //     'q': [
      //       // 'id',
      //       'config'
      //       // { 'metadata': ['path'] }
      //     ],
      //     // 'transformation': [
      //     //   { 'orderBy': { 'index': 'r.desc(timestamp)' } }
      //     //   // 'slice:0:1'
      //     // ],
      //     'aggregation': 'distinct',
      //     'filter': [{ 'metadata': { 'host': vm.host } }]
      //   }
      // },
      // {
      //   params: { id: _key },
      //   path: 'all',
      //   range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
      //   query: {
      //     'from': 'munin_historical',
      //     // 'register': 'changes',
      //     'format': 'tabular',
      //     'index': false,
      //     /**
      //     * right now needed to match OUTPUT 'id' with this query (need to @fix)
      //     **/
      //     'q': [
      //       // {
      //       //   'metadata': [
      //       //     'timestamp',
      //       //     'path'
      //       //   ]
      //       // },
      //       // 'metadata',
      //       'data'
      //     ],
      //     'transformation': [
      //       {
      //         'orderBy': { 'index': 'r.desc(timestamp)' }
      //       }
      //     ],
      //     'filter': [
      //       { 'metadata': { 'host': vm.host } },
      //       { 'metadata': { 'type': 'minute' } }
      //     ]
      //
      //   }
      // }]
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    // debug('PERIODICAL HOST CALLBACK %o %o %s', data, metadata, key)

    if (key === 'periodical.range' && data.munin) {
      Object.each(data.munin, function (plugin, name) {
        if (!vm.plugins[name]) {
          vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        } else if (vm.plugins[name].periodical) { // if data already exists
          let _plugin = JSON.parse(JSON.stringify(vm.plugins[name].periodical))

          Object.each(plugin, function (data, prop) {
            // _plugin[prop].combine(data)
            Array.each(data, function (_data) {
              _plugin[prop].push(_data)
            })
            // sort by first column, timestamp
            // _plugin[prop].sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
          })

          plugin = _plugin
        }
        debug('PERIODICAL HOST CALLBACK %o ', plugin)

        vm.$set(vm.plugins[name], 'periodical', plugin)

        // debug('PERIODICAL HOST CALLBACK %o ', JSON.parse(JSON.stringify(vm.plugins)))

      //   if (!vm.plugins_config[name]) {
      //     let config_comp_req = Object.clone(config_component_req)
      //
      //     // config_comp_req.params.query.filter[0].metadata.host = metadata.filter.metadata.host
      //     // config_comp_req.params.query.filter[1].metadata.path = name
      //     config_comp_req.host = metadata.filter.metadata.host
      //     config_comp_req.path = name
      //
      //     debug('CONFIG_COMP %o', config_comp_req)
      //     vm.$set(vm.components, name, {
      //       source: {
      //         requests: {
      //           once: [
      //             config_comp_req
      //           ]
      //         }
      //       }
      //     })
      //   }
      })
      //
      // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].options.requests.once = vm.__components_sources_to_requests(vm.components).once
      // // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnce')
      // vm.destroy_pipelines()
      // vm.create_pipelines()
    } else if (key === 'minute.range' && data.munin_historical) {
      Object.each(data.munin_historical, function (plugin, name) {
        if (!vm.plugins[name]) {
          vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        }
        // else if (vm.plugins[name].minute) {
        //   let _plugin = JSON.parse(JSON.stringify(vm.plugins[name].minute))
        //
        //   Object.each(plugin, function (data, prop) {
        //     _plugin[prop].combine(data)
        //
        //     // sort by first column, timestamp
        //     _plugin[prop].sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
        //   })
        //
        //   plugin = _plugin
        // }
        //
        // // debug('PERIODICAL HOST CALLBACK %o', plugin)

        vm.$set(vm.plugins[name], 'minute', plugin)
      })
    } else if (key === 'config.range' && data.munin) {
      // Object.each(data.munin_historical, function (plugin, name) {
      //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
      //   vm.$set(vm.plugins[name], 'minute', plugin)
      // })
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
        // vm.$set(vm.plugins_config, path, config)

        // if (category && !vm.plugins_categories.contains(category)) {
        //   vm.plugins_categories.push(category)
        // }
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
      // let host = metadata.filter[0].metadata.host
      // let name = metadata.filter[1].metadata.path
      // let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined
      //
    }

    // vm.$set(vm.munin, data.munin)
    //
    // // Object.each(data., function (data, table) {
    // //   vm.$set(vm.munin, table, data)
    // // })
    //
    // vm.$set(vm.components, 'periodical', )
    // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
    // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
  }
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