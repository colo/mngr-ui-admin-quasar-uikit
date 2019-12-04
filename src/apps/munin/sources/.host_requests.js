import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:host_requests')

const SECOND = 1000
const MINUTE = 60 * SECOND

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm)

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
            query: {
              'from': 'munin',
              'q': [
                'config',
                { 'metadata': ['path'] }
              ],
              'aggregation': 'distinct',
              'filter': [{ 'metadata': { 'host': vm.host } }]
            }
          }]

          break
        case 'minute.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (11 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'munin_historical',
              'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
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
  callback: function (data, metadata, key, vm) {
    if (key === 'periodical.once' && data.munin) {
      Object.each(data.munin, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        if (vm.$refs[name] && vm.$refs[name][0] && !vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

        vm.$nextTick(function () {
          let _plugin
          if (vm.$refs[name] && vm.$refs[name][0]) {
            if (vm.$refs[name][0].$options.plugin_data && vm.$refs[name][0].$options.plugin_data.periodical) { // if data already exists
              _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))

              Object.each(plugin, function (data, prop) {
                if (_plugin[prop]) {
                  _plugin[prop].combine(data)
                } else if (!Array.isArray(data)) {
                  _plugin[prop] = [data]
                } else {
                  _plugin[prop] = data
                }

                // sort by first column, timestamp
                _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
              })
            } else {
              _plugin = plugin
            }

            vm.$refs[name][0].set_data({ periodical: _plugin })
          }
        })
      })
    } else if (key === 'minute.once' && data.munin_historical) {
      debug('MINUTE HOST ONCE CALLBACK %o ', JSON.parse(JSON.stringify(data.munin_historical)))

      Object.each(data.munin_historical, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        if (vm.$refs[name] && vm.$refs[name][0] && !vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

        vm.$nextTick(function () {
          let _plugin
          if (vm.$refs[name] && vm.$refs[name][0] && vm.$refs[name][0].$options.plugin_data && vm.$refs[name][0].$options.plugin_data.minute) { // if data already exists
            _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))

            Object.each(plugin, function (data, prop) {
              if (_plugin[prop]) {
                _plugin[prop].combine(data)
              } else if (!Array.isArray(data)) {
                _plugin[prop] = [data]
              } else {
                _plugin[prop] = data
              }

              // sort by first column, timestamp
              _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
            })
          } else {
            _plugin = plugin
          }

          vm.$refs[name][0].set_data({ minute: _plugin })
        })
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
}

const host_range_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm)

    const MINUTE = 60000

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
              'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
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
  callback: function (data, metadata, key, vm) {
    debug('PERIODICAL HOST CALLBACK %o %o %s', data, vm.$refs, key)

    if (key === 'periodical.range' && data.munin) {
      Object.each(data.munin, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })

        vm.$nextTick(function () {
          let _plugin

          if (vm.$refs[name] && vm.$refs[name][0] && !vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

          if (vm.$refs[name] && vm.$refs[name][0]) {
            if (vm.$refs[name][0].$options.plugin_data && vm.$refs[name][0].$options.plugin_data.periodical) { // if data already exists
              _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.periodical))

              Object.each(plugin, function (data, prop) {
                if (_plugin[prop]) {
                  _plugin[prop].combine(data)
                } else if (!Array.isArray(data)) {
                  _plugin[prop] = [data]
                } else {
                  _plugin[prop] = data
                }

                // sort by first column, timestamp
                _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
              })
            } else {
              _plugin = plugin
            }

            vm.$refs[name][0].set_data({ periodical: _plugin })
          }
        })
      })
    } else if (key === 'minute.range' && data.munin_historical) {
      Object.each(data.munin_historical, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        if (vm.$refs[name] && vm.$refs[name][0] && !vm.$refs[name][0].$options.plugin_data) vm.$refs[name][0].$options.plugin_data = { periodical: undefined, minute: undefined }

        vm.$nextTick(function () {
          let _plugin
          if (vm.$refs[name] && vm.$refs[name][0]) {
            if (vm.$refs[name][0].$options.plugin_data && vm.$refs[name][0].$options.plugin_data.minute) { // if data already exists
              _plugin = JSON.parse(JSON.stringify(vm.$refs[name][0].$options.plugin_data.minute))

              Object.each(plugin, function (data, prop) {
                if (_plugin[prop]) {
                  _plugin[prop].combine(data)
                } else if (!Array.isArray(data)) {
                  _plugin[prop] = [data]
                } else {
                  _plugin[prop] = data
                }

                // sort by first column, timestamp
                _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
              })
            } else {
              _plugin = plugin
            }

            vm.$refs[name][0].set_data({ minute: _plugin })
          }
        })
      })
    }
  }
}

const once = [
  // host_once_component
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
