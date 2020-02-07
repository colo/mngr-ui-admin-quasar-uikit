<template>
  <div>

  </div>
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
const debug = Debug('apps:neataptic')

import JSPipeline from 'js-pipeline'

import Pipeline from '@apps/neataptic/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

// import OsHostCard from '@apps/neataptic/components/hostCard.vue'

import { requests, store } from '@apps/neataptic/sources/index'
// import moment from 'moment'

import neataptic from 'neataptic'
// import { Network, methods } from 'neataptic'

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
  neatapticData: undefined,
  tensorData: undefined,

  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.neataptic',

      id: 'neataptic',
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
        // data = JSON.parse(JSON.stringify(data))
        // data = JSON.parse(JSON.stringify(data))
        data = this.shuffle(JSON.parse(JSON.stringify(data)))
        const SPLIT = data.length * 0.8 // 70%
        // let test = this.shuffle(data.slice(0, data.length / 2))
        // let train = this.shuffle(data.slice(data.length / 2, data.length))
        const train = data.slice(0, SPLIT)
        const test = data.slice(SPLIT + 1)

        debug('values %o', data)

        let read = this.min_max(data, 0)
        let written = this.min_max(data, 1)
        let sectors = this.min_max(data, 2)
        let queue = this.min_max(data, 3)
        let idle = this.min_max(data, 4)
        let usage = this.min_max(data, 5)

        debug('read %o written %o sectors %o queue %o idle %o usage %o', read, written, sectors, queue, idle, usage)

        let trainData = train.map(d => {
          // return {
          //   input: [
          //     this.normalize(d[0], read.min, read.max),
          //     this.normalize(d[1], written.min, written.max)
          //   ],
          //   output: [
          //     // this.normalize(d[2], sectors.min, sectors.max),
          //     // this.normalize(d[3], queue.min, queue.max),
          //     this.normalize(d[4], idle.min, idle.max)
          //     // this.normalize(d[5], usage.min, usage.max)
          //   ]
          // }
          return {
            input: [
              this.normalize(d[4], idle.min, idle.max)
            ],
            output: [
              this.normalize(d[0], read.min, read.max),
              this.normalize(d[1], written.min, written.max)
              // this.normalize(d[2], sectors.min, sectors.max),
              // this.normalize(d[3], queue.min, queue.max),

              // this.normalize(d[5], usage.min, usage.max)
            ]
          }
        })
        debug('trainData', trainData)

        let testData = test.map(d => {
          // return {
          //   input: [
          //     this.normalize(d[0], read.min, read.max),
          //     this.normalize(d[1], written.min, written.max)
          //   ],
          //   output: [
          //     // this.normalize(d[2], sectors.min, sectors.max),
          //     // this.normalize(d[3], queue.min, queue.max),
          //     this.normalize(d[4], idle.min, idle.max)
          //     // this.normalize(d[5], usage.min, usage.max)
          //   ]
          // }
          return {
            input: [
              this.normalize(d[4], idle.min, idle.max)
            ],
            output: [
              this.normalize(d[0], read.min, read.max),
              this.normalize(d[1], written.min, written.max)
              // this.normalize(d[2], sectors.min, sectors.max),
              // this.normalize(d[3], queue.min, queue.max),

              // this.normalize(d[5], usage.min, usage.max)
            ]
          }
        })

        debug('testData', testData)

        let network = new neataptic.architect.LSTM(1, 3, 2)
        // let network = new neataptic.architect.NARX(2, 3, 1, 1, 1)

        network.train(trainData, {
          // cost: neataptic.methods.cost.MSE, // default - bad
          cost: neataptic.methods.cost.CROSS_ENTROPY,
          // cost: neataptic.methods.cost.BINARY,
          // cost: neataptic.methods.cost.MAE, // *
          // cost: neataptic.methods.cost.MAPE, // bad
          // cost: neataptic.methods.cost.MSLE, // bad
          // cost: neataptic.methods.cost.HINGE, // bad
          log: 100,
          iterations: 2000,
          error: 0.001,
          clear: true,
          rate: 0.5
          // crossValidate:
          //   {
          //     testSize: 0.4,
          //     testError: 0.02
          //   }
        })

        // let accuracy = this.getAccuracy(network, testData)
        //
        // debug('accuracy', network.toJSON(), network.fromJSON(network.toJSON()))

        // // let forecast = [[0, 2000], [4100, 0], [4100, 2000], [170000, 0]] // normal delete - this read - this read + normal delete
        // let forecast = [[0, 287], [800, 0], [800, 200], [23000, 3400], [150000, 128]] // normal delete - this read - this read + normal delete
        //
        // let forecastData = forecast.map(d => {
        //   return [this.normalize(d[0], read.min, read.max), this.normalize(d[1], written.min, written.max)]
        // })
        //
        // forecastData.forEach((datapoint) => {
        //   debug('RUN datapoint', datapoint)
        //   let output = network.activate([datapoint[0], datapoint[1]])
        //   // debug('RUN forecast %o - sectors %d - queue %d - idle %d', output, this.denormalize(output[0], sectors.min, sectors.max), this.denormalize(output[1], queue.min, queue.max), this.denormalize(output[2], idle.min, idle.max))
        //   debug('RUN forecast - read %d - written %d - %o - idle %d - usage %d', this.denormalize(datapoint[0], read.min, read.max), this.denormalize(datapoint[1], written.min, written.max), output, this.denormalize(output, idle.min, idle.max), this.denormalize(output[1], usage.min, usage.max))
        // })

        let forecast = [0, 40000] // normal delete - this read - this read + normal delete

        let forecastData = forecast.map(d => {
          return [this.normalize(d, idle.min, idle.max)]
        })

        forecastData.forEach((datapoint) => {
          debug('RUN datapoint', datapoint)
          let output = network.activate([datapoint])
          // debug('RUN forecast %o - sectors %d - queue %d - idle %d', output, this.denormalize(output[0], sectors.min, sectors.max), this.denormalize(output[1], queue.min, queue.max), this.denormalize(output[2], idle.min, idle.max))
          debug('RUN forecast - idle %d - read %d - written %d', this.denormalize(datapoint, idle.min, idle.max), this.denormalize(datapoint[1], written.min, written.max), output, this.denormalize(output[0], read.min, read.max), this.denormalize(output[1], written.min, written.max))
        })

        debug('read %o written %o sectors %o queue %o idle %o usage %o', read, written, sectors, queue, idle, usage)
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
  //   neatapticvis.render.scatterplot(
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

    getAccuracy: function (net, testData) {
      let hits = 0
      testData.forEach((datapoint) => {
        let input = datapoint.input
        let output = net.activate([input[0], input[1]])
        // const outputArray = [Math.round(output)]
        // debug('getAccuracy', datapoint.input, output, datapoint.output)
        if (Math.round(output[0]) === Math.round(datapoint.output[0]) && Math.round(output[1]) === Math.round(datapoint.output[1]) && Math.round(output[2]) === Math.round(datapoint.output[2])) {
          hits += 1
        }
        // output.forEach((outpoint, index) => {
        //   if (Math.round(outpoint) === Math.round(datapoint.output[index])) {
        //     hits += 1
        //   }
        // })
        //
        // hits = hits / output.length

        // if (outputArray[0] === Math.round(datapoint.output[0])) {
        //   hits += 1
        // }
      })
      return hits / testData.length
    },
    shuffle: function (a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },

    min_max: function (data, column) {
      let min, max
      Array.each(data, function (d) {
        let col = d[column]

        min = (min === undefined || min > col) ? col : min
        max = (max === undefined || max < col) ? col : max
      })

      return { min, max }
    },
    normalize: function (value, min, max) {
      return (value - min) / (max - min)
    },
    denormalize: function (value, min, max) {
      // return (value - min) / (max - min)
      return (value * (max - min)) + min
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

      if (this.$options.pipelines['input.neataptic'] && this.$options.pipelines['input.neataptic'].get_input_by_id('input.neataptic')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.neataptic'].get_input_by_id('input.neataptic').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.neataptic'].get_input_by_id('input.neataptic').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.neataptic'].get_input_by_id('input.neataptic').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.neataptic'].get_input_by_id('input.neataptic').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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

<style>
  .flex-container {
    display: flex;
    flex-flow: row wrap;
    background-color: #f1f1f1;
  }

  .flex-container > div {
    background-color: #f1f1f1;
    margin: 10px;
    padding: 20px 0px 30px 50px;
    font-size: 20px;
  }

  .flex-container2 {
    display: flex;
    justify-content: space-between;
    background-color: #f1f1f1;
  }

  .flex-container2 > div {
    background-color: #f1f1f1;
    margin: 0px;
    padding: 4px;
    font-size: 20px;
  }

  .form-wrapper {
    margin: 0 auto;
    max-width: 200px;
    padding: 15px;
    align-self: flex-start;
    flex-grow: 1;
    width: 400px;
  }

  .input-wrapper {
    padding: 0 0 10px 0;
  }

  .input-label {
    padding: 0 0 5px 0;
    color: #808080;
  }

  .numeric {
    text-align: right;
    width: 50px;
  }

  button {
    background-color: rgb(0, 75, 0);
    color: #fff;
    border-radius: 10px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    padding: 15px;
    width: 150px;
    cursor: pointer;
  }

  button:hover, button:active, button:visited {
    background-color: green;
  }

  #result {
    padding-top: 100px;
    padding-left: 100px;
  }
</style>
