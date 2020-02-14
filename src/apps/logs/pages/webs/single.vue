<template>
  <q-page>
    <vk-card class="uk-background-secondary">
    <vk-breadcrumb>
      <router-link to="/" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Home</vk-breadcrumb-item>
      </router-link>

      <router-link to="/logs" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Logs</vk-breadcrumb-item>
      </router-link>

      <router-link to="/logs/webs" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Webs</vk-breadcrumb-item>
      </router-link>

      <router-link :to="'/logs/webs/'+type" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item v-bind="(!type) ? {'disabled' : true} : ''" :href="href" @click="navigate">{{type}}</vk-breadcrumb-item>
      </router-link>

      <vk-breadcrumb-item v-if="web">{{web}}</vk-breadcrumb-item>

    </vk-breadcrumb>

    <!-- <router-link
      to="/logs/categories"
      v-slot="{ href, route, navigate, isActive, isExactActive }"
    >

      <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Categories</vk-button-link>
    </router-link> -->

    </vk-card>
  </q-page>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:pages:webs:single')

//

// let moment = require('moment')

import OsPluginDygraph from '@apps/logs/components/pluginDygraph'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/logs/pipelines/webs/single'

import { requests, store } from '@apps/logs/sources/webs/single/index'

// const MAX_FEED_DATA = 10

export default {
  mixins: [DataSourcesMixin],

  components: { OsPluginDygraph },

  name: 'LogsWeb',

  data () {
    return {
      id: 'logs.webs.single',
      path: 'all',

      // os: [],
      store: false,
      pipeline_id: 'input.logs.webs.single',

      plugins: [],
      // plugins_config: {},
      plugins_categories: [],

      components: {
        range: {
          // source: {
          //   requests: {
          //     once: [],
          //     periodical: []
          //   }
          // }
          source: {
            // requests: requests

            // store: store
          }
        }

      }
    }
  },

  computed: {
    'web': function () {
      return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    },
    'type': function () {
      return (this.$route && this.$route.params && this.$route.params.type) ? this.$route.params.type : undefined
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

      if (this.$options.pipelines['input.logs.webs.single'] && this.$options.pipelines['input.logs.webs.single'].get_input_by_id('input.os')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.logs.webs.single'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.logs.webs.single'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.logs.webs.single'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.logs.webs.single'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id
        // let pipeline_id = 'input.logs.webs.single'

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
  //   this.pipeline_id = 'input.logs.webs.single'
  // },
  // create: function () {
  //   debug('created HOST %s %o %o', this.web, this.$options.range_component, this.$options.__pipelines_cfg)
  //   // EventBus.$on(this.pipeline_id, this.__process_input_data)
  //
  //   // if (this.store) this.__register_store_module(this.id, sourceStore)
  //   // this.__bind_components_to_sources(this.components)
  //   // this.create_pipelines()
  //
  //   // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.web = this.web
  //   // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.web = this.web
  //   // this.$set(this.components, 'range', this.$options.range_component)
  //   // this.$set(this.components, 'feed', this.$options.feed_component)
  //   // this.components.range.source.requests.once.push(this.$options.range_component)
  //
  //   this.components.range.source.requests.periodical.push(this.$options.range_component)
  // }

}
</script>
