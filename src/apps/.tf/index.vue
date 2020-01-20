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

  // values: [],

  model: undefined,
  tfData: undefined,
  tensorData: undefined,

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
      handler: function (data) {
        this.$options.tfData = JSON.parse(JSON.stringify(data))
        debug('values %o', this.$options.tfData)

        this.$nextTick(function () {
          // const values = val.map(d => ({
          //   x: Math.round(d.time_in_queue) * 1,
          //   y: d.idle
          // }))
          this.$options.model = this.createModel()
          // tfvis.show.modelSummary({ name: 'Model Summary' }, model)
          // Convert the data to a form we can use for training.
          this.$options.tensorData = this.convertToTensor(this.$options.tfData)

          debug('tensorData', this.$options.tensorData)

          const { inputs, labels } = this.$options.tensorData

          // Train the model
          this.trainModel(this.$options.model, inputs, labels)
          debug('DONE')
          // this.testModel(this.$options.model, this.$options.tfData, this.$options.tensorData)
          // const container = document.getElementById('Written_v_Idle')
          //
          // tfvis.render.scatterplot(
          //   container,
          //   { values },
          //   {
          //     xLabel: 'Written',
          //     yLabel: 'Idle',
          //     height: 300
          //   }
          // )
        }.bind(this))
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
    createModel: function () {
      // // Create a sequential model
      const model = tf.sequential()

      // Add a single hidden layer
      model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))

      // Add an output layer
      model.add(tf.layers.dense({ units: 1, useBias: true }))

      // return model

      // model.add(tf.layers.dense({
      //   inputShape: [1],
      //   units: 1,
      //   activation: 'sigmoid',
      //   kernelInitializer: 'leCunNormal'
      // }))
      // model.add(tf.layers.dense({ units: 1 }))

      model.summary()
      return model
    },
    convertToTensor: function (data) {
      // Wrapping these calculations in a tidy will dispose any
      // intermediate tensors.

      return tf.tidy(() => {
        // Step 1. Shuffle the data
        tf.util.shuffle(data)

        // Step 2. Convert data to Tensor

        const inputs = data.map(d => d[1])
        const labels = data.map(d => d[2])
        debug('tidy', inputs, labels)

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1], 'int32')
        const labelTensor = tf.tensor2d(labels, [labels.length, 1], 'int32')

        // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max()
        const inputMin = inputTensor.min()
        const labelMax = labelTensor.max()
        const labelMin = labelTensor.min()

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

        return {
          inputs: normalizedInputs,
          labels: normalizedLabels,
          // Return the min/max bounds so we can use them later.
          inputMax,
          inputMin,
          labelMax,
          labelMin
        }
      })
    },
    trainModel: function (model, inputs, labels) {
      let self = this
      // Prepare the model for training.
      model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse']
      })
      // model.compile({ optimizer: tf.train.sgd(0.001), loss: 'meanSquaredError' })

      const batchSize = 16
      const epochs = 50

      return model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        // callbacks: tfvis.show.fitCallbacks(
        //   { name: 'Training Performance' },
        //   ['loss', 'mse'],
        //   { height: 200, callbacks: ['onEpochEnd'] }
        // )
        callbacks: {
          onTrainBegin: (logs) => {
            debug('onTrainBegin', logs)
          },
          onTrainEnd: (logs) => {
            debug('onTrainEnd', logs)
            self.testModel(self.$options.model, self.$options.tfData, self.$options.tensorData)
          }
        }
      })
    },
    testModel: function (model, inputData, normalizationData) {
      const { inputMax, inputMin, labelMin, labelMax } = normalizationData

      // Generate predictions for a uniform range of numbers between 0 and 1;
      // We un-normalize the data by doing the inverse of the min-max scaling
      // that we did earlier.
      const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, 100)
        const preds = model.predict(xs.reshape([100, 1]))

        const unNormXs = xs
          .mul(inputMax.sub(inputMin))
          .add(inputMin)

        const unNormPreds = preds
          .mul(labelMax.sub(labelMin))
          .add(labelMin)

        // Un-normalize the data
        return [unNormXs.dataSync(), unNormPreds.dataSync()]
      })

      const predictedPoints = Array.from(xs).map((val, i) => {
        return { x: val, y: preds[i] }
      })

      debug('inputData %o', inputData)

      const originalPoints = inputData.map(d => ({
        x: d[1], y: d[2]
      }))

      debug('predictedPoints %o', predictedPoints)
      // tfvis.render.scatterplot(
      //   { name: 'Model Predictions vs Original Data' },
      //   { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
      //   {
      //     xLabel: 'Horsepower',
      //     yLabel: 'MPG',
      //     height: 300
      //   }
      // )
    },
    // run: async function () {
    //   // const apples = Array(14)
    //   //   .fill(0)
    //   //   .map(y => Math.random() * 100 + Math.random() * 50)
    //   //   .map((y, x) => ({ x: x, y: y }))
    //   //
    //   // const oranges = Array(14)
    //   //   .fill(0)
    //   //   .map(y => Math.random() * 100 + Math.random() * 150)
    //   //   .map((y, x) => ({ x: x, y: y }))
    //   //
    //   // const series = ['Apples', 'Oranges']
    //   //
    //   // const data = { values: [apples, oranges], series }
    //   //
    //   // // const container = document.getElementById()
    //   // tfvis.render.scatterplot({ name: 'scatter-cont' }, data, {
    //   //   xLabel: 'day',
    //   //   yLabel: 'sales',
    //   //   height: 450,
    //   //   zoomToFit: true,
    //   //   fontSize: 16
    //   // })
    //   // Create the model
    //   // const model = this.createModel()
    //   // // tfvis.show.modelSummary({ name: 'Model Summary' }, model)
    //   // // Convert the data to a form we can use for training.
    //   // const tensorData = this.convertToTensor(data)
    //   // const { inputs, labels } = tensorData
    //   //
    //   // // Train the model
    //   // await this.trainModel(model, inputs, labels)
    //   // debug('DONE')
    // },
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
