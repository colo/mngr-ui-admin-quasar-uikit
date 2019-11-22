import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:host_requests')

const config_component_req = {
  params: {
    path: 'all',
    // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
    query: {
      'from': 'munin',
      'index': false,

      'q': [
        // 'id',
        'config'
      ],
      'transformation': [
        { 'orderBy': { 'index': 'r.desc(timestamp)' } },
        'slice:0:1'
      ],
      'filter': [{ 'metadata': { 'host': undefined } }, { 'metadata': { 'path': undefined } }]
    }

  },
  callback: function (data, metadata, key, vm) {
    debug('CONFIG %o %o', data, metadata)
    let host = metadata.filter[0].metadata.host
    let name = metadata.filter[1].metadata.path
    let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined

    vm.$set(vm.plugins_config, name, config)
  }
}

const host_range_component = {
  params: function (_key, vm) {
    debug('PERIODICAL %o %o', _key, vm)

    const MINUTE = 60000

    let source
    let key

    if (!_key) {
      key = ['periodical.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        path: 'all',
        range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
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
      },
      {
        params: { id: _key },
        path: 'all',
        range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
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
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    debug('PERIODICAL HOST CALLBACK %o %o', data, metadata)

    if (data.munin) {
      Object.each(data.munin, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        vm.$set(vm.plugins[name], 'periodical', plugin)

        if (!vm.plugins_config[name]) {
          let config_comp_req = Object.clone(config_component_req)

          config_comp_req.params.query.filter[0].metadata.host = metadata.filter.metadata.host
          config_comp_req.params.query.filter[1].metadata.path = name
          debug('CONFIG_COMP %o', config_comp_req)
          vm.$set(vm.components, name, {
            source: {
              requests: {
                once: [
                  config_comp_req
                ]
              }
            }
          })
        }
      })

      // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].options.requests.once = vm.__components_sources_to_requests(vm.components).once
      // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnce')
      vm.destroy_pipelines()
      vm.create_pipelines()
    } else if (data.munin_historical) {
      Object.each(data.munin_historical, function (plugin, name) {
        if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
        vm.$set(vm.plugins[name], 'minute', plugin)
      })
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
  host_range_component
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
