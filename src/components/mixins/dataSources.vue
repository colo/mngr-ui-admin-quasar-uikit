<script>

import * as Debug from 'debug'
const debug = Debug('components:mixins:DataSources')

// import dataStore from 'src/store/data'
import sourceStore from 'src/store/source'

import { EventBus } from '@libs/eventbus'

// import { mapState, mapGetters } from 'vuex'

let qs = require('qs')

export default {
  // name: 'data-sources',

  // components: {
  //
  // },

  pipelines: {},
  __pipelines_cfg: {},
  unwatch_store: undefined,

  ON_PIPELINE_READY: 'onPipelineReady',

  // sources: {
  //   data: {},
  //   stat: {},
  //   tabular: {}
  // },

  data () {
    return {
      // id: undefined,
      store: false,
      pipeline_id: undefined
    }
  },

  watch: {
    store: function (val) {
      debug('watch store', val)
      if (val) this.__register_store_module(this.id, sourceStore)
    }
  },
  created: function () {
    debug('created')
    EventBus.$on(this.path, this.__process_input_data.bind(this))

    if (this.store) this.__register_store_module(this.id, sourceStore)
    this.__bind_components_to_sources(this.components)
    this.create_pipelines()
  },

  mounted: function () {
    debug('mounted')
    this.resume_pipelines()
  },
  // updated: function () {
  // },
  destroy: function () {
    debug('destroy')
    this.destroy_pipelines()
    this.__unregister_store_module(this.id)
  },

  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    this.suspend_pipelines()
    this.__unregister_store_module(this.id)
    next()
  },
  // computed: mapState({
  //
  //   'periodical?register=periodical&transformation=limit%3A30000.range' (state) {
  //     debug('computed', state[this.path + '_sources']['periodical?register=periodical&transformation=limit%3A30000'])
  //     return (state[this.path + '_sources']['periodical?register=periodical&transformation=limit%3A30000']) ? state[this.path + '_sources']['periodical?register=periodical&transformation=limit%3A30000'].range : undefined
  //   }
  // }),
  // computed: {
  //   // mix the getters into computed with object spread operator
  //   ...mapGetters([
  //     'doneTodosCount',
  //     'anotherGetter',
  //     // ...
  //   ])
  // }
  methods: {
    __bind_components_to_sources: function (_components) {
      for (const prop in _components) {
        let components = _components[prop]

        if (!Array.isArray(components)) {
          components = [components]
        }

        for (const index in components) {
          // if (components[index].source && components[index].source.requests) {
          if (components[index].source) {
            let _sources = components[index].source
            let reqs
            for (const req_type in _sources) {
              if (req_type === 'requests') {
                reqs = []
                Object.each(_sources.requests, function (_req, type) {
                  if (_req) { reqs.combine(_req) }
                })
                // reqs = Array.combine(_sources.requests.once, _sources.requests.periodical)
              } else {
                reqs = _sources[req_type]
              }

              if (!Array.isArray(reqs)) { reqs = [reqs] }

              for (let j = 0; j < reqs.length; j++) {
                // let key = reqs[j].params
                // let source = reqs[j].params
                // let callback = reqs[j].callback

                // debug('__components_sources_to_requests', j, reqs, typeof (source))

                // debug('__components_sources_to_requests', req_type, key)
                // debug('__bind_components_to_sources TYPE', typeof (reqs[j].params), reqs)

                if (reqs[j] && reqs[j].params && typeof reqs[j].params === 'function') {
                  reqs[j].params = reqs[j].params.bind(components[index])
                  // source.bind(components[index])
                }
                // if (typeof callback === 'function') {
                //   // reqs[j].params = callback.bind(components[index])
                // }
                // debug('__components_sources_to_requests', req_type, key)
                //
                // if (!sources[req_type]) sources[req_type] = {}
                //
                // sources[req_type][key] = source
              }
            }
          }
        }
      }
    },
    __update_component_data: function (component, key, type, payload) {
      debug('__update_component_data', component, key, type, Object.clone(payload))
      let callback = this.__get_source_callback_from_key(component.source, key, type)

      debug('__update_component_data', callback)

      if (callback && typeof callback === 'function') {
        callback.attempt([payload.data, payload.metadata, key, this], component)
        // callback(data)
      }
    },
    __get_source_callback_from_key: function (source, key, input) {
      input = input || 'requests'
      let callback

      for (const type in source) {
        if (type === input) {
          if (type === 'store') {
            let reqs = source[type]
            if (!Array.isArray(reqs)) reqs = [reqs]

            for (let i = 0; i < reqs.length; i++) {
              if (reqs[i] && reqs[i].params) {
                let _key = this.__query_to_key(reqs[i].params)
                if (_key === key || (Array.isArray(_key) && _key.indexOf(key) > -1)) {
                  debug('__get_source_callback_from_key', reqs[i])
                  callback = reqs[i].callback
                }
              }
            }
          } else {
            for (const req_type in source[type]) {
              let reqs = source[type][req_type]
              if (!Array.isArray(reqs)) reqs = [reqs]

              for (let i = 0; i < reqs.length; i++) {
                if (reqs[i] && reqs[i].params) {
                  let _key = this.__query_to_key(reqs[i].params)
                  // if(Array.isArray(_key) && _key.indexOf(key) > -1 ){
                  //   let index = _key.indexOf(key)
                  // }
                  // else
                  if (_key === key || (Array.isArray(_key) && _key.indexOf(key) > -1)) {
                    debug('__get_source_callback_from_key', reqs[i])
                    callback = reqs[i].callback
                  }
                }
              }
            }
          }
        }
      }

      return callback
    },
    __source_to_keys: function (source, input) {
      debug('__source_to_keys -> %o %s', source, input)
      input = input || 'requests'
      let keys = []
      for (const type in source) {
        if (type === input) {
          if (type === 'store') {
            let reqs = source[type]
            if (!Array.isArray(reqs)) reqs = [reqs]

            debug('__source_to_keys STORE %o', reqs)

            for (let i = 0; i < reqs.length; i++) {
              if (reqs[i] && reqs[i].params) {
                let key = this.__query_to_key(reqs[i].params)
                if (Array.isArray(key)) {
                  Array.each(key, function (_key) {
                    keys.push(_key)
                  })
                } else {
                  keys.push(key)
                }
              }
            }
          } else {
            for (const req_type in source[type]) {
              let reqs = source[type][req_type]
              if (!Array.isArray(reqs)) reqs = [reqs]

              debug('__source_to_keys REQUEST %o', reqs)

              for (let i = 0; i < reqs.length; i++) {
                if (reqs[i] && reqs[i].params) {
                  let key = this.__query_to_key(reqs[i].params)
                  if (Array.isArray(key)) {
                    Array.each(key, function (_key) {
                      keys.push(_key)
                    })
                  } else {
                    keys.push(key)
                  }
                }
              }
            }
          }
        }
      }

      debug('__source_to_keys KEYS', keys, input)
      return keys
    },
    __query_to_key: function (query) {
      if (typeof query === 'function') {
        let _result = query.attempt()
        debug('__query_to_key', _result)
        return _result.key
      } else if (typeof query === 'string') {
        return query
      } else {
        let _query = Object.merge(query.query, query.body)
        debug('__query_to_string', query.path + '?' + qs.stringify(_query))
        return query.path + '?' + qs.stringify(_query)
      }
    },

    __register_store_module: function (id, module) {
      debug('__register_store_module', id)

      // if (!process.env.DEV) { if (old && this.$store.state['data_sources_' + old]) { this.$store.unregisterModule('data_sources_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state[id + '_sources']) { this.$store.registerModule(id + '_sources', Object.clone(module)) }

      // this.$store.commit(this.id + '_sources/add', { id: 'periodical?register=periodical&transformation=limit%3A30000', data: { range: [] } })

      // this.$store.watch((state) => state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000'], (val, oldVal) => {
      this.$options.unwatch_store = this.$store.watch((state) => state[id + '_sources'], (val, oldVal) => {
        debug('$store watch %o', val)
        Object.each(val, function (payload, id) {
          this.__process_data(payload, 'store')
        }.bind(this))
        //   // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000']) { this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', {}) }
        //
        //   debug('watcher', val)
        //   if (val['range']) {
        //     for (const index in val['range']) {
        //       this.$set(this.components['6'][0].options.range, index, val['range'][index])
        //     }
        //   }
        //   // for (const key in val) {
        //   //   if (Array.isArray(val[key])) {
        //   //     // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, null)
        //   //     for (const i in val[key]) {
        //   //       if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, [])
        //   //       this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key], i, val[key][i])
        //   //     }
        //   //   } else {
        //   //     this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, val[key])
        //   //   }
        //   // }
        //   // this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', val)
        //   // this.$set(this.MyRange, 0, val.range[0])
        //   // this.$set(this.MyRange, 1, val.range[1])
      }, {
        deep: true
      })
    },
    __unregister_store_module: function (id) {
      debug('__unregister_store_module', id)

      if (!process.env.DEV) {
        if (id && this.$store.state[id + '_sources']) {
          if (this.$options.unwatch_store) {
            this.$options.unwatch_store()
          }
          this.$store.unregisterModule(id + '_sources')
        }
      }
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
    },
    __process_input_data: function (payload) {
      debug('__process_input_data', payload)
      // for (const key in payload.data) {
      //   this.$store.commit(this.id + '_sources/append', { id: payload.id, key: key, data: payload.data[key] })
      // }
      if (this.store === true) {
        this.$store.commit(this.id + '_sources/add', payload)
      }
      // else {
      this.__process_data(payload, 'requests')
      // }
    },
    __process_data: function (payload, type) {
      type = type || 'requests'
      let key = payload.id
      // convert to array of array so it can be pass as parameter
      // if (Array.isArray(payload.data)) payload.data = [payload.data]

      for (const prop in this.components) {
        let components = this.components[prop]
        // if (!Array.isArray(components)) components = [components]

        if (Array.isArray(components)) {
          for (let index = 0; index < components.length; index++) {
            if (
              components[index].source &&
              this.__source_to_keys(components[index].source, type).contains(key)
            ) {
              this.__update_component_data(components[index], key, type, payload)
            }
          }
        } else {
          if (components.source && this.__source_to_keys(components.source, type).contains(key)) {
            this.__update_component_data(components, key, type, payload)
          }
        }
      }
    },
    __components_sources_to_requests: function (_components) {
      let requests = {}
      let sources = {}

      // let _components = JSON.parse(JSON.stringify(this.components))
      // debug('__components_sources_to_requests', _components)
      for (const prop in _components) {
        let components = _components[prop]

        if (!Array.isArray(components)) {
          components = [components]
        }

        for (const index in components) {
          if (components[index].source && components[index].source.requests) {
            let _requests = components[index].source.requests

            for (const req_type in _requests) {
              let reqs = _requests[req_type]
              if (!Array.isArray(reqs)) { reqs = [reqs] }

              for (let j = 0; j < reqs.length; j++) {
                if (reqs[j] && reqs[j].params) {
                  let key = reqs[j].params
                  let source = reqs[j].params

                  // debug('__components_sources_to_requests', j, reqs, typeof (source))

                  // debug('__components_sources_to_requests', req_type, key)
                  debug('__components_sources_to_requests TYPE', typeof (source), reqs)

                  if (typeof source === 'string') {
                    source = { path: source.substring(0, source.indexOf('?')), query: qs.parse(source.substring(source.indexOf('?') + 1)) }
                  } else if (typeof source === 'function') {
                    // source = source.bind(components[index])
                    // let _result = source.attempt(undefined, components[index])
                    let _result = source.attempt([undefined, this])
                    debug('__components_sources_to_requests RESULT', _result, components[index])
                    key = _result.key
                    // source = { bind: components[index], function: source }
                    // source = _result.source
                  } else {
                    key = key.path + '?' + qs.stringify(Object.merge(key.query, key.body))
                  }

                  if (!sources[req_type]) sources[req_type] = {}

                  if (Array.isArray(key)) {
                    Array.each(key, function (_key, index) {
                      debug('__components_sources_to_requests', req_type, _key)
                      sources[req_type][_key] = source// always the same source...function
                    })
                  } else {
                    sources[req_type][key] = source
                  }
                }
              }
            }
          }
        }
      }

      debug('__components_sources_to_requests', sources)
      let self = this
      for (const req_type in sources) {
        if (!requests[req_type]) requests[req_type] = []

        for (const key in sources[req_type]) {
          let query = sources[req_type][key]

          requests[req_type].push({
            init: function (req, next, app) {
              debug('INIT %s %o', key, query)
              let _query = query
              // if (typeof query === 'function') { _query = query.pass(key)().source }
              if (typeof query === 'function') { _query = query.attempt([key, self]).source }// don't use "this" as is the pipeline.input context

              // if (query.bind && query.function) { _query = query.function.attempt(key, query.bind).source }

              if (_query !== undefined) {
                if (!Array.isArray(_query)) {
                  _query = [Object.clone(_query)]
                } else {
                  _query = Array.clone(_query)
                }

                for (let i = 0; i < _query.length; i++) {
                  debug('io EMIT', _query[i])
                  app.io.emit('/', _query[i])
                }
              }

              debug('FUNC EMIT', _query)

              // next()
            }
          })
        }

        // for (const key in sources[req_type]) {
        //   let query = Object.clone({ query: sources[req_type][key].query })
        //   requests[req_type].push(query)
        // }

        // let fun = {}
        // fun[req_type] = function (req, next, app) {
        //   for (const key in sources[req_type]) {
        //     let query = Object.clone({ query: sources[req_type][key].query })
        //
        //     // app.io.emit('/', query)
        //     app.io.emit(['/', query])
        //     debug('FUNC EMIT', query, app.)
        //
        //     // requests[req_type].push({
        //     //   init: function (req, next, app) {
        //     //   // debug('INIT', app)
        //     //     app.io.emit('/', query)
        //     //     debug('FUNC EMIT', query)
        //     //   }
        //     // })
        //   }
        // }

        // requests[req_type].push(fun)
      }

      debug('__components_sources_to_requests REQUEST', requests)
      return requests
      // template.input[0].poll.conn[0].requests.once.push({
      //   init: function (req, next, app) {
      //     debug('INIT', app)
      //     app.io.emit('/', {
      //       query: { register: 'periodical' },
      //       body: {
      //         'transformation': 'limit:30000'
      //
      //       }
      //     })
      //   }
      // })
    },

    suspend_pipelines: function () {
      debug('suspend_pipelines %s', this.pipeline_id)

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        if (id === this.pipeline_id) {
          pipe.fireEvent('onSuspend')
          // pipe.fireEvent('onExit')
          // pipe.removeEvents()
          //
          // delete this.$options.pipelines[id]
        }
      }.bind(this))

      debug('suspend_pipelines', this.$options.pipelines)
    },
    resume_pipelines: function () {
      debug('resume_pipelines %s', this.pipeline_id)

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        if (id === this.pipeline_id) {
          pipe.fireEvent('onResume')
          // pipe.fireEvent('onExit')
          // pipe.removeEvents()
          //
          // delete this.$options.pipelines[id]
        }
      }.bind(this))

      debug('resume_pipelines', this.$options.pipelines)
    },
    destroy_pipelines: function () {
      debug('destroy_pipelines')

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        pipe.fireEvent('onSuspend')
        pipe.fireEvent('onExit')
        pipe.removeEvents()

        delete this.$options.pipelines[id]
      }.bind(this))

      debug('destroy_pipelines', this.$options.pipelines)
    },
    __after_connect_inputs: function (pipeline, cfg, cb) {
      let _client_connect = function (index) {
        debug('__after_connect_inputs %o %d', cfg.connected, index)

        // cfg.connected.push(true)
        cfg.connected[index] = true
        if (cfg.connected.every(function (input) { return input }) && pipeline.inputs.length === cfg.connected.length && cb && typeof cb === 'function') {
          cb()
        }

        pipeline.inputs[index].removeEvent('onClientConnect', _client_connect)
      }

      Array.each(pipeline.inputs, function (input, index) {
        debug('__after_connect_inputs INPUT', input.conn_pollers)
        if (Object.getLength(input.conn_pollers) > 0 && Object.every(input.conn_pollers, function (poller, key) { return poller.connected })) {
          debug('__after_connect_inputs ALREADY CONNECTED', index)
          _client_connect(index)
        } else {
          input.addEvent('onClientConnect', _client_connect.pass(index))
        }
      })
    },
    /**
    * use event === false on get_pipeline, so it won't fire the event
    **/
    __resume_pipeline: function (pipeline, cfg, id, cb, event) {
      debug('__resume_pipeline', pipeline, cfg, id)

      if (id) {
        if (!cfg.ids.contains(id)) { cfg.ids.push(id) }

        if (cfg.suspended === true) {
          debug('__resume_pipeline this.pipeline.connected', cfg.connected)

          if (cfg.connected.every(function (item) { return item === true })) {
            cfg.suspended = false
            pipeline.fireEvent('onResume')
          } else {
            let __resume = []
            Array.each(pipeline.inputs, function (input, index) {
              if (cfg.connected[index] !== true) {
                __resume[index] = function () {
                  this.__resume_pipeline(pipeline, cfg, id)
                  input.conn_pollers[0].removeEvent('onConnect', __resume[index])
                }
                input.conn_pollers[0].addEvent('onConnect', () => __resume[index])
              }
            })
          }
        }
      }

      // this.chain(cb, this.fireEvent('ON_PIPELINE_READY', pipeline));

      if (cb) {
        // if (event === false) {
        cb()
        // } else {
        //   let _chain = new Chain()
        //   _chain.chain(
        //     cb,
        //     this.fireEvent.pass([this.$options.ON_PIPELINE_READY, pipeline], this)
        //   )
        //
        //   while (_chain.callChain() !== false) {}
        // }
      } else {
        this.fireEvent(this.$options.ON_PIPELINE_READY, pipeline)
      }
    }

    /**
    * @end pipelines
    **/
  }
}

// import 'admin-lte/dist/js/adminlte.min.js'
</script>
