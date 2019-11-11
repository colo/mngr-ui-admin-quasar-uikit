<template>
  <div class="about">
    <h1>This is an about page</h1>
    <vk-card>
      <vk-button>...</vk-button>
    </vk-card>
  </div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

export default {
  mixins: [DataSourcesMixin],

  name: 'Munin',
  // components: {
  //   HelloWorld
  // }

  // pipelines: {},
  // __pipelines_cfg: {},
  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,

      id: 'all',
      path: 'all',

      components: {
        'all': [{
          source: {
            requests: {
              periodical: [{
                params: {
                  path: 'all',
                  query: {
                    'from': 'munin',
                    'index': 'host',
                    'filter': [
                      // "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
                      // "r.row('data')('code').gt(399)",
                      // "r.row('metadata')('path').eq('educativa.checks.vhosts')",
                      // "r.row('metadata')('type').eq('check')",
                      "r.row('metadata')('host').eq('colo')"
                    ]
                  }
                },
                callback: function (tables, metadata, key, vm) {
                  debug('All ABOUT callback', tables, vm.$options.grid_template)
                }
              }]
            }
          }
        }]
      }
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

        let pipeline_id = 'input.munin'

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
