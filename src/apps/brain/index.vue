<template>
  <div></div>
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
const debug = Debug('apps:brain')

import JSPipeline from 'js-pipeline'

import Pipeline from '@apps/brain/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

// import OsHostCard from '@apps/brain/components/hostCard.vue'

import { requests, store } from '@apps/brain/sources/index'
// import moment from 'moment'

import * as brain from 'brain.js'
// import * as brainvis from '@tensorflow/brainjs-vis'

export default {
  mixins: [DataSourcesMixin],

  // components: { JsonViewer },
  // extends: DataSourcesMixin,

  name: 'Brain',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  // values: [],

  model: undefined,
  brainData: undefined,
  tensorData: undefined,

  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.brain',

      id: 'brain',
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
      handler: function (data) {
        this.$options.brainData = JSON.parse(JSON.stringify(data))
        debug('values %o', this.$options.brainData)

        const net = new brain.recurrent.LSTMTimeStep({
          inputSize: 1,
          hiddenLayers: [10],
          outputSize: 1
        })
        let brainData = this.$options.brainData.map(d => {
          return [d[1], d[2]]
        })

        debug('data %o', brainData)
        net.train(brainData, {
          iterations: 2000, // the maximum times to iterate the training data --> number greater than 0
          errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
          log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
          logPeriod: 10, // iterations between logging out --> number greater than 0
          learningRate: 0.01 // scales with delta to effect training rate --> number between 0 and 1
        })

        // debug('forecast', net.forecast([[1,5],[2,4]], 3))
        // this.$nextTick(function () {
        //
        // })
      }
    }
  },
  // mounted: function () {
  //   if (document.readyState !== 'loading') {
  //     this.run()
  //   } else {
  //     document.addEventListener('DOMContentLoaded', this.run)
  //   }
  // },

  // updated: function () {
  //   debug('updated %o', this.$options.values)
  //   let values = this.$options.values
  //   brainvis.render.scatterplot(
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
    createModel: function () {

    },
    convertToTensor: function (data) {

    },
    trainModel: function (model, inputs, labels) {

    },
    testModel: function (model, inputData, normalizationData) {

    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.brain'] && this.$options.pipelines['input.brain'].get_input_by_id('input.brain')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.brain'].get_input_by_id('input.brain').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.brain'].get_input_by_id('input.brain').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.brain'].get_input_by_id('input.brain').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.brain'].get_input_by_id('input.brain').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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
