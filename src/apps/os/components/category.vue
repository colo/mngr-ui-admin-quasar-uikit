<template>
  <div>

  <template v-for="(host) in plugins_hosts">
    <a :id="host" :key="host+'.anchor'"/>
    <vk-card class="uk-background-secondary uk-light" :key="host">
      <vk-card-title>
        <h3 class="uk-light">{{host}}</h3>
      </vk-card-title>
      <!-- <template v-for="(config, name) in plugins_config_per_host">
        <os-plugin-dygraph :ref="name" :id="host+'.'+name" :data="plugins[name]" :config="config" :key="host+'.'+name+'.plugin'"/>
      </template> -->
      <template v-for="(name) in plugins">

        <!-- {{host}}
        {{name}} -->
        <!-- <a :id="name" :key="name+'.anchor'"/> -->
        <os-plugin-dygraph v-if="name.indexOf(host) > -1" :ref="name" :id="name" :name="name"  :key="name+'.plugin'"/>
          <!-- :data="plugin" -->
      </template>
    </vk-card>

  </template>

    <!-- <template v-for="(plugin, name) in plugins">

      <os-plugin-dygraph :ref="name" :id="name" :data="plugin" :key="name+'.plugin'"/>
    </template> -->
</div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:os:components:category')

//

// let moment = require('moment')

import OsPluginDygraph from './pluginDygraph'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/os/pipelines/category'

import { requests, store } from '../sources/category'

// const MAX_FEED_DATA = 10

export default {
  mixins: [DataSourcesMixin],

  components: { OsPluginDygraph },

  name: 'OSHost',

  data () {
    return {
      id: 'os.category',
      path: 'all',

      // os: [],
      store: false,
      pipeline_id: 'input.os.category',

      plugins: [],
      // plugins_config: {},
      plugins_hosts: [],

      components: {
        range: {
          // source: {
          //   requests: {
          //     once: [],
          //     periodical: []
          //   }
          // }
          source: {
            requests: requests

            // store: store
          }
        }

      }
    }
  },

  watch: {
    // 'plugins_config': function (val) {
    //   debug('watch plugins_config %o', val.graph)
    // }
  },
  methods: {

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.os.category'] && this.$options.pipelines['input.os.category'].get_input_by_id('input.os')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.os.category'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.os.category'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.os.category'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.os.category'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id
        // let pipeline_id = 'input.os.category'

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

  },
  computed: {
    'category': function () {
      return (this.$route && this.$route.params && this.$route.params.category) ? this.$route.params.category : undefined
    }
  }
  // computed: {
  //
  // //   count: function () {
  // //     let result = 0
  // //     Array.each(this.groups, function (group) {
  // //       result += group.count
  // //     })
  // //
  // //     return result
  // //   }
  // },
  // mounted: function () {
  //   this.pipeline_id = 'input.os.category'
  // },
  // create: function () {
  //   debug('created HOST %s %o %o', this.category, this.$options.range_component, this.$options.__pipelines_cfg)
  //   // EventBus.$on(this.pipeline_id, this.__process_input_data)
  //
  //   // if (this.store) this.__register_store_module(this.id, sourceStore)
  //   // this.__bind_components_to_sources(this.components)
  //   // this.create_pipelines()
  //
  //   // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.category = this.category
  //   // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.category = this.category
  //   // this.$set(this.components, 'range', this.$options.range_component)
  //   // this.$set(this.components, 'feed', this.$options.feed_component)
  //   // this.components.range.source.requests.once.push(this.$options.range_component)
  //
  //   this.components.range.source.requests.periodical.push(this.$options.range_component)
  // }

}
</script>
