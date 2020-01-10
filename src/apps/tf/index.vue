<template>
  <div :id="'Written_v_Idle'"></div>
  <!-- <q-page>

    <vk-card class="uk-background-secondary">
    <vk-breadcrumb>
      <router-link to="/" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Home</vk-breadcrumb-item>
      </router-link>

      <vk-breadcrumb-item disabled>Tf</vk-breadcrumb-item>
    </vk-breadcrumb>
    </vk-card>

    <vk-card class="uk-background-secondary">

    </vk-card>
  </q-page> -->
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:tf')

import JSPipeline from 'js-pipeline'

import Pipeline from '@apps/tf/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

// import OsHostCard from '@apps/tf/components/hostCard.vue'

import { requests, store } from '@apps/tf/sources/index'
// import moment from 'moment'

import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

export default {
  mixins: [DataSourcesMixin],

  // components: { JsonViewer },
  // extends: DataSourcesMixin,

  name: 'TF',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  values: [],

  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.tf',

      id: 'tf',
      path: 'all',

      values: [],

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
  watch: {
    'values': {
      deep: true,
      handler: function (val) {
        // debug('values %o', val)

        // const values = val.map(d => ({
        //   x: Math.round(d.written) * 1,
        //   y: d.idle
        // }))

        const container = document.getElementById('Written_v_Idle')

        // const data = { values: values }
        // debug('values %o %o', data)

        const apples = Array(14)
          .fill(0)
          .map(y => Math.random() * 100 + Math.random() * 50)
          .map((y, x) => ({ x: x, y: y }))

        const oranges = Array(14)
          .fill(0)
          .map(y => Math.random() * 100 + Math.random() * 150)
          .map((y, x) => ({ x: x, y: y }))

        const series = ['Apples', 'Oranges']

        const data = { values: [apples, oranges], series }

        // const container = document.getElementById("scatter-cont");
        tfvis.render.scatterplot(container, data, {
          xLabel: 'day',
          yLabel: 'sales',
          height: 450,
          zoomToFit: true,
          fontSize: 16
        })

        // tfvis.render.scatterplot(
        //   container,
        //   data,
        //   {
        //     xLabel: 'Written',
        //     yLabel: 'Idle',
        //     height: 300
        //   }
        // )
      }
    }
  },
  // mounted: function () {
  //
  // },
  // updated: function () {
  //   debug('updated %o', this.$options.values)
  //   let values = this.$options.values
  //   tfvis.render.scatterplot(
  //     { name: 'Written v Idle' },
  //     { values },
  //     {
  //       xLabel: 'Written',
  //       yLabel: 'Idle',
  //       height: 300
  //     }
  //   )
  // },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.tf'] && this.$options.pipelines['input.tf'].get_input_by_id('input.tf')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.tf'].get_input_by_id('input.tf').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.tf'].get_input_by_id('input.tf').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.tf'].get_input_by_id('input.tf').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.tf'].get_input_by_id('input.tf').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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
