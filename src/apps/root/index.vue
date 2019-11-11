<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <vk-card class="uk-background-secondary">

      <router-link
        to="/munin"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Munin</vk-button-link>
      </router-link>
    </vk-card>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:root')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/root/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

export default {
  mixins: [DataSourcesMixin],

  name: 'Root',
  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: true,
      pipeline_id: 'input.root',

      id: 'all',
      path: 'all',

      components: {
        'all': [
          {
            source: {
              requests: {
                periodical: [{
                  params: {
                    path: 'all',
                    query: {
                      'from': 'educativa',
                      'index': 'host',
                      'filter': [
                        "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
                        "r.row('data')('code').gt(399)",
                        "r.row('metadata')('path').eq('educativa.checks.vhosts')",
                        "r.row('metadata')('type').eq('check')",
                        "r.row('metadata')('host').eq('colo')"
                      ]
                    }
                  },
                  callback: function (tables, metadata, key, vm) {
                    debug('All callback', tables, vm.$options.grid_template)
                  }
                }]
              }
            }
          },
          {
            source: {
              store: [
                {
                  params: {
                    path: 'all',
                    // query: 'all?from=educativa&index=host&filter%5B0%5D=r.row%28%27metadata%27%29%28%27tag%27%29.contains%28%27enabled%27%29.and%28%27nginx%27%29.and%28%27vhost%27%29&filter%5B1%5D=r.row%28%27data%27%29%28%27code%27%29.gt%28399%29&filter%5B2%5D=r.row%28%27metadata%27%29%28%27path%27%29.eq%28%27educativa.checks.vhosts%27%29&filter%5B3%5D=r.row%28%27metadata%27%29%28%27type%27%29.eq%28%27check%27%29&filter%5B4%5D=r.row%28%27metadata%27%29%28%27host%27%29.eq%28%27colo%27%29'
                    query: {
                      'from': 'educativa',
                      'index': 'host',
                      'filter': [
                        "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
                        "r.row('data')('code').gt(399)",
                        "r.row('metadata')('path').eq('educativa.checks.vhosts')",
                        "r.row('metadata')('type').eq('check')",
                        "r.row('metadata')('host').eq('colo')"
                      ]
                    }
                  },
                  callback: function (tables, metadata, key, vm) {
                    debug('STORE callback', tables, vm.$options.grid_template)
                  }
                }
              ]
            }
          }
        ]
      }
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.root'] && this.$options.pipelines['input.root'].get_input_by_id('input.root')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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
