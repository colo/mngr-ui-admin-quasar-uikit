import * as Debug from 'debug'
const debug = Debug('apps:logs:sources:webs:filter:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

let total_bytes_sent = {}
let hits = {}

let user_agent_os_counter = {}
let user_agent_os_family_counter = {}
let user_agent_engine_counter = {}
let user_agent_browser_counter = {}
let user_agent_device_counter = {}

let status_counter = {}

let city_counter = {}
let country_counter = {}
let continent_counter = {}
let world_map_city_counter = []

let addr_counter = {}
let user_counter = {}
let referer_counter = {}

let type_counter = {}

import static_types from '../../../data/static_extentions'

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL HOST CALLBACK data %s %o', key, data)

  // const END = 1557246080000 // test data
  const END = Date.now() // production

  if (/periodical/.test(key) && data) { // (data.logs || Object.getLength(data) > 0)
    const START = END - MINUTE

    let _data
    if (data.logs) _data = data.logs // comes from 'Range'
    else _data = data // comes from 'register'

    if (!_data.data) _data.data = {}

    debug('PERIODICAL HOST CALLBACK _data %o', _data)

    /**
    * logs
    **/
    let logs = []
    let log_template = _data[0].metadata
    Array.each(_data[0].data.log, function (row) {
      logs.push(Object.merge(Object.clone(log_template), { log: row.value, timestamp: row.timestamp }))
    })

    /**
    * bytes & hits
    **/
    let current_bytes_sent = 0
    Array.each(_data[0].data.body_bytes_sent, function (row, index) {
      if (index === 0) {
        current_bytes_sent = row.value
      }

      if (!hits[row.timestamp]) hits[row.timestamp] = 0
      hits[row.timestamp] += 1

      if (!total_bytes_sent[row.timestamp]) total_bytes_sent[row.timestamp] = 0
      total_bytes_sent[row.timestamp] += row.value
    })

    let periodical_total_bytes_sent = 0
    let periodical_hits = 0
    Object.each(total_bytes_sent, function (val, ts) {
      if (ts < START) {
        delete total_bytes_sent[ts]
        delete hits[ts]
      } else {
        let hit = hits[ts]
        periodical_total_bytes_sent += val
        periodical_hits += hit
      }
    })

    /**
    * status
    **/
    Array.each(_data[0].data.status, function (row, index) {
      if (!status_counter[row.timestamp]) status_counter[row.timestamp] = {}
      if (!status_counter[row.timestamp][row.value]) status_counter[row.timestamp][row.value] = 0
      status_counter[row.timestamp][row.value] += 1
    })

    let periodical_status_counter = {}
    Object.each(status_counter, function (val, ts) {
      if (ts < START) {
        delete status_counter[ts]
      } else {
        Object.each(val, function (data, status) {
          if (!periodical_status_counter[status]) periodical_status_counter[status] = 0
          periodical_status_counter[status] += data
        })
      }
    })

    /**
    * city - country - continent
    **/
    let _tmp_periodical_world_map_city_counter = {}
    Array.each(_data[0].data.geoip, function (row, index) {
      let country = (row.value.country) ? (row.value.country.names) ? (row.value.country.names.en) ? row.value.country.names.en : row.value.country.names.es : undefined : undefined
      let continent = (row.value.continent) ? (row.value.continent.names) ? (row.value.continent.names.en) ? row.value.continent.names.en : row.value.continent.names.es : undefined : undefined
      let city = (row.value.city && country) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined

      let world_map_city = (row.value.location && row.value.location.latitude && row.value.location.longitude) ? row.value.location + ':' + row.value.location.latitude : undefined
      let world_map_city_name = (row.value.city) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined

      if (city && !city_counter[row.timestamp]) city_counter[row.timestamp] = {}
      if (country && !country_counter[row.timestamp]) country_counter[row.timestamp] = {}
      if (continent && !continent_counter[row.timestamp]) continent_counter[row.timestamp] = {}

      if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp]) world_map_city_counter[row.timestamp] = {}

      if (city && country && !city_counter[row.timestamp][city]) city_counter[row.timestamp][city] = 0
      if (country && !country_counter[row.timestamp][country]) country_counter[row.timestamp][country] = 0
      if (continent && !continent_counter[row.timestamp][continent]) continent_counter[row.timestamp][continent] = 0

      if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp][world_map_city]) world_map_city_counter[row.timestamp][world_map_city] = { name: world_map_city_name, count: 0, latitude: row.value.location.latitude, longitude: row.value.location.longitude }

      if (city) { city_counter[row.timestamp][city] += 1 }
      if (country) country_counter[row.timestamp][country] += 1
      if (continent) continent_counter[row.timestamp][continent] += 1

      if (world_map_city && world_map_city_name) world_map_city_counter[row.timestamp][world_map_city].count += 1
    })

    let periodical_city_counter = {}
    let periodical_country_counter = {}
    let periodical_continent_counter = {}

    Object.each(city_counter, function (val, ts) {
      if (ts < START) {
        delete city_counter[ts]
        delete country_counter[ts]
        delete continent_counter[ts]
        delete world_map_city_counter[ts]
      } else {
        let country_val = country_counter[ts]
        let continent_val = continent_counter[ts]
        let world_map_city_val = world_map_city_counter[ts]

        Object.each(val, function (data, city) {
          if (!periodical_city_counter[city]) periodical_city_counter[city] = 0
          periodical_city_counter[city] += data
        })

        Object.each(country_val, function (data, country) {
          if (!periodical_country_counter[country]) periodical_country_counter[country] = 0
          periodical_country_counter[country] += data
        })

        Object.each(continent_val, function (data, continent) {
          if (!periodical_continent_counter[continent]) periodical_continent_counter[continent] = 0
          periodical_continent_counter[continent] += data
        })

        Object.each(world_map_city_val, function (data, world_map_city) {
          // if (!periodical_continent_counter[continent]) periodical_continent_counter[continent] = 0
          // periodical_continent_counter[continent] += data

          if (!_tmp_periodical_world_map_city_counter[world_map_city]) {
            _tmp_periodical_world_map_city_counter[world_map_city] = data
          } else {
            _tmp_periodical_world_map_city_counter[world_map_city].count += data.count
          }
        })
      }
    })

    let periodical_world_map_city_counter = []

    Object.each(_tmp_periodical_world_map_city_counter, function (data, world_map_city) {
      periodical_world_map_city_counter.push({
        title: data.name + ' ( hits: ' + data.count + ' )',
        latitude: data.latitude,
        longitude: data.longitude
      })
    })

    /**
    * address (IP)
    **/
    Array.each(_data[0].data.remote_addr, function (row, index) {
      if (!addr_counter[row.timestamp]) addr_counter[row.timestamp] = {}
      if (!addr_counter[row.timestamp][row.value]) addr_counter[row.timestamp][row.value] = 0
      addr_counter[row.timestamp][row.value] += 1
    })

    let periodical_addr_counter = {}
    Object.each(addr_counter, function (val, ts) {
      if (ts < START) {
        delete addr_counter[ts]
      } else {
        Object.each(val, function (data, addr) {
          if (!periodical_addr_counter[status]) periodical_addr_counter[addr] = 0
          periodical_addr_counter[addr] += data
        })
      }
    })

    /**
    * user
    **/
    Array.each(_data[0].data.remote_user, function (row, index) {
      if (!user_counter[row.timestamp]) user_counter[row.timestamp] = {}
      if (!user_counter[row.timestamp][row.value]) user_counter[row.timestamp][row.value] = 0
      user_counter[row.timestamp][row.value] += 1
    })

    let periodical_user_counter = {}
    Object.each(user_counter, function (val, ts) {
      if (ts < START) {
        delete user_counter[ts]
      } else {
        Object.each(val, function (data, user) {
          if (!periodical_user_counter[user]) periodical_user_counter[user] = 0
          periodical_user_counter[user] += data
        })
      }
    })

    /**
    * Static & Dynamic types
    **/
    Array.each(_data[0].data.pathname, function (row, index) {
      let value = (static_types.test(row.value)) ? 'static' : 'dynamic'
      // debug('TYPE %o', row.value, type)
      if (!type_counter[row.timestamp]) type_counter[row.timestamp] = {}
      if (!type_counter[row.timestamp][value]) type_counter[row.timestamp][value] = 0
      type_counter[row.timestamp][value] += 1
    })

    let periodical_type_counter = {}
    Object.each(type_counter, function (val, ts) {
      if (ts < START) {
        delete type_counter[ts]
      } else {
        Object.each(val, function (data, type) {
          if (!periodical_type_counter[type]) periodical_type_counter[type] = 0
          periodical_type_counter[type] += data
        })
      }
    })

    /**
    * referer
    **/
    Array.each(_data[0].data.referer, function (row, index) {
      // debug('REFERER %o', row.value)
      let value = (row.value.referer) ? row.value.referer + ' - ' + row.value.medium : row.value.medium
      if (!referer_counter[row.timestamp]) referer_counter[row.timestamp] = {}
      if (!referer_counter[row.timestamp][value]) referer_counter[row.timestamp][value] = 0
      referer_counter[row.timestamp][value] += 1
    })

    let periodical_referer_counter = {}
    Object.each(referer_counter, function (val, ts) {
      if (ts < START) {
        delete referer_counter[ts]
      } else {
        Object.each(val, function (data, referer) {
          if (!periodical_referer_counter[referer]) periodical_referer_counter[referer] = 0
          periodical_referer_counter[referer] += data
        })
      }
    })

    /**
    * User Agent
    **/
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
      browser = (row.value.ua.type) ? browser + ' ' + row.value.ua.type : browser

      user_agent_browser_counter[row.timestamp] = browser

      // let device = row.value.device.family
      // device = (row.value.device.brand) ? device + ' ' + row.value.device.brand : device
      // device = (row.value.device.model) ? device + '.' + row.value.device.model : device
      // device = (row.value.device.type) ? device + '.' + row.value.device.type : device

      let device = (row.value.device.brand) ? row.value.device.brand : row.value.device.family
      device = (row.value.device.model) ? device + ' ' + row.value.device.model : device
      device = (row.value.device.type) ? device + ' - ' + row.value.device.type : device

      user_agent_device_counter[row.timestamp] = device
    })

    let periodical_user_agent_os_counter = {}
    let periodical_user_agent_os_family_counter = {}
    let periodical_user_agent_engine_counter = {}
    let periodical_user_agent_browser_counter = {}
    let periodical_user_agent_device_counter = {}

    Object.each(user_agent_os_counter, function (val, ts) {
      if (ts < START) {
        delete user_agent_os_counter[ts]
        delete user_agent_os_family_counter[ts]
      } else {
        let family = user_agent_os_family_counter[ts]
        let engine = user_agent_engine_counter[ts]
        let browser = user_agent_browser_counter[ts]
        let device = user_agent_device_counter[ts]

        if (!periodical_user_agent_os_counter[val]) periodical_user_agent_os_counter[val] = 0
        if (!periodical_user_agent_os_family_counter[family]) periodical_user_agent_os_family_counter[family] = 0
        if (!periodical_user_agent_engine_counter[engine]) periodical_user_agent_engine_counter[engine] = 0
        if (!periodical_user_agent_browser_counter[browser]) periodical_user_agent_browser_counter[browser] = 0
        if (!periodical_user_agent_device_counter[device]) periodical_user_agent_device_counter[device] = 0

        periodical_user_agent_os_counter[val] += 1
        periodical_user_agent_os_family_counter[family] += 1
        periodical_user_agent_engine_counter[engine] += 1
        periodical_user_agent_browser_counter[browser] += 1
        periodical_user_agent_device_counter[device] += 1
      }
    })

    // vm.periodical = {}

    if (logs.length > 0) {
      // vm.logs = logs
      vm.$set(vm.periodical, 'logs', logs)
      vm.loading_logs = false
    }

    vm.$set(vm.periodical, 'total_bytes_sent', periodical_total_bytes_sent)
    vm.$set(vm.periodical, 'hits', periodical_hits)

    vm.$set(vm.periodical, 'current_bytes_sent', current_bytes_sent)

    vm.$set(vm.periodical, 'status_counter', periodical_status_counter)

    vm.$set(vm.periodical, 'city_counter', periodical_city_counter)
    vm.$set(vm.periodical, 'country_counter', periodical_country_counter)
    vm.$set(vm.periodical, 'continent_counter', periodical_continent_counter)
    vm.$set(vm.periodical, 'world_map_cities', periodical_world_map_city_counter)

    vm.$set(vm.periodical, 'addr_counter', periodical_addr_counter)
    vm.$set(vm.periodical, 'user_counter', periodical_user_counter)
    vm.$set(vm.periodical, 'referer_counter', periodical_referer_counter)
    vm.$set(vm.periodical, 'type_counter', periodical_type_counter)

    vm.$set(vm.periodical, 'user_agent_os_counter', periodical_user_agent_os_counter)
    vm.$set(vm.periodical, 'user_agent_os_family_counter', periodical_user_agent_os_family_counter)
    vm.$set(vm.periodical, 'user_agent_engine_counter', periodical_user_agent_engine_counter)
    vm.$set(vm.periodical, 'user_agent_browser_counter', periodical_user_agent_browser_counter)
    vm.$set(vm.periodical, 'user_agent_device_counter', periodical_user_agent_device_counter)
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
      // const END = 1557246080000 //= > office test data

      /**
      * production
      **/
      const END = Date.now()

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

// const host_once_register = {
//   params: function (_key, vm) {
//     // debug('REGISTER host_once_register %o %o', _key, vm)
//
//     let source
//     let key
//
//     if (!_key) {
//       key = ['periodical.register', 'minute.register']// , 'config.once'
//       // key = ['config.once']
//     }
//
//     // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'periodical.register':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             // range: 'posix ' + (Date.now() - (10 * MINUTE)) + '-' + Date.now() + '/*',
//             // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
//             query: {
//               'from': 'os',
//               'register': 'changes',
//               'format': 'tabular',
//               'index': false,
//               'opts': { includeTypes: true, squash: false },
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
//                 'id',
//                 'data'
//                 // { 'metadata': ['host'] }
//               ],
//               // 'transformation': [
//               //   {
//               //     'orderBy': { 'index': 'r.desc(timestamp)' }
//               //   }
//               // ],
//               'filter': [
//                 { 'metadata': { 'host': vm.host } },
//                 "r.row('metadata')('path').ne('os.procs')"
//               ]
//
//             }
//           }]
//           break
//
//         case 'minute.register':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             // range: 'posix ' + (Date.now() - (12 * MINUTE)) + '-' + Date.now() + '/*',
//             query: {
//               'from': 'os_historical',
//               'register': 'changes',
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
//                 'id',
//                 'data'
//                 // { 'metadata': ['host', 'type'] }
//               ],
//               // 'transformation': [
//               //   {
//               //     'orderBy': { 'index': 'r.desc(timestamp)' }
//               //   }
//               // ],
//               'filter': [
//                 { 'metadata': { 'host': vm.host } },
//                 { 'metadata': { 'type': 'minute' } },
//                 "r.row('metadata')('path').ne('os.procs')"
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

const host_range_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['periodical.range', 'config.range', 'minute.range']
      key = ['periodical.range', 'minute.range', 'hour.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      // const END = 1557246080000 //= > office test data

      /**
      * production
      **/
      const END = Date.now()

      let START

      switch (_key) {
        case 'periodical.range':
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

        case 'minute.range':
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

        case 'hour.range':
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

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  host_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
