<template>
  <div>
    <template v-for="(host_categories, host_name) in hosts_categories">
      <munin-host-card
        :key="host_name"
        v-if="!host || host_name === host"
        :categories="host_categories"
        :host="host_name"
      />
    </template>

    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:hosts')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

import MuninHostCard from './hostCard.vue'

import { requests, store } from '../sources/index'

export default {
  mixins: [DataSourcesMixin],
  components: { MuninHostCard },
  // extends: DataSourcesMixin,

  name: 'MuninHosts',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      // host: undefined,
      hosts_categories: {},
      categories: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.munin',

      id: 'munin',
      path: 'all',

      components: {
        'all': [
          {
            source: {
              requests: requests,

              store: store
            }
          }

        ]
      }
    }
  },
  computed: {
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.munin'] && this.$options.pipelines['input.munin'].get_input_by_id('input.munin')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id

        template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)

        let pipe = new JSPipeline(template)

        this.$options.__pipelines_cfg[pipeline_id] = {
          ids: [],
          connected: [],
          suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
        }

        // this.__after_connect_inputs(
        //   pipe,
        //   this.$options.__pipelines_cfg[pipeline_id],
        //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
        //     debug('__resume_pipeline CALLBACK')
        //     pipe.fireEvent('onOnce')
        //   }], this)
        // )

        this.$options.pipelines[pipeline_id] = pipe

        debug('create_pipelines %o', this.$options.pipelines)

        if (next) { next() }
      }
    }

    /**
    * @end pipelines
    **/

  }
}
</script>
