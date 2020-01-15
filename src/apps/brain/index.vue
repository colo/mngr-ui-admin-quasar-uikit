<template>
  <div class="flex-container">
    <div class="form-wrapper">
      <form id="network-settings" action="" method="POST">
        <div class="input-wrapper">
          <div class="input-label">Network type</div>
          <select name="network-type">
            <option value="NeuralNetwork">FeedForward (brain.NeuralNetwork)</option>
            <option value="RNN">Recurrent (brain.recurrent.RNN)</option>
            <option value="RNNTimeStep">Recurrent Time Step (brain.recurrent.RNNTimeStep)</option>
            <option value="FeedForward">FeedForward (brain.FeedForward)</option>
            <option value="Recurrent">Recurrent (brain.Recurrent)</option>
          </select>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Network size</div>
          <input type="text" name="size" placeholder="" value="10,8,6,2"/>
        </div>
        <div class="flex-container2">
          <div class="input-wrapper">
            <div class="input-label">Height</div>
            <input type="text" class="numeric" name="height" placeholder="Height" value="400"/>
          </div>
          <div class="input-wrapper">
            <div class="input-label">Width</div>
            <input type="text" class="numeric" name="width" placeholder="Width" value="600"/>
          </div>
        </div>
        <div class="flex-container2">
          <div class="input-wrapper">
            <div class="input-label">Neuron radius</div>
            <input type="text" name="radius" class="numeric" placeholder="in pixels" value="6"/>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Inputs color</div>
          <input type="text" name="inp-color" placeholder="" value="rgba(0, 128, 0, 0.5)"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Hidden color</div>
          <input type="text" name="hid-color" placeholder="" value="rgba(255, 127, 80, 0.5)"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Outputs color</div>
          <input type="text" name="out-color" placeholder="" value="rgba(100, 149, 237, 0.5)"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Recurrent line color</div>
          <input type="text" name="recurrent-line-color" placeholder="" value="red"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Line width</div>
          <input type="text" class="numeric" name="line-width" placeholder="number" value="0.5"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Line color</div>
          <input type="text" name="line-color" placeholder="css color" value="black"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Font size</div>
          <input type="text" name="font-size" placeholder="size in px" value="14px"/>
        </div>
        <div class="input-wrapper">
          <div class="input-label">Inputs' labels</div>
          <textarea rows="3" name="inp-labels" cols="23" placeholder="inputs' labels separated by commas"></textarea>
        </div>
        <div class="input-wrapper">
          <label class="input-label"><input type="checkbox" name="use-json" value="1" />Use JSON</label>
        </div>
        <div class="input-wrapper">
          <button id="submit" type="submit">Render</button>
        </div>
      </form>
    </div>
    <div id="result"></div>
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
        data = JSON.parse(JSON.stringify(data))
        let test = data.slice(0, data.length / 2)
        let train = data.slice(data.length / 2, data.length)

        debug('values %o', data)

        const net = new brain.recurrent.RNNTimeStep({
          // inputSize: 1,
          hiddenLayers: [1, 1],
          outputSize: 1
        })

        let { minIn, maxIn, minOut, maxOut } = this.min_max(data)

        let trainData = data.map(d => {
          return { input: { sectors: this.normalize(d[1], minIn, maxIn) }, output: { idle: this.normalize(d[2], minOut, maxOut) } }
        })
        debug('trainData', trainData)
        // let testData = train.map(d => {
        //   return d[1]
        // })

        net.train(trainData, {
          iterations: 2000, // the maximum times to iterate the training data --> number greater than 0
          errorThresh: 0.001, // the acceptable error percentage from training data --> number between 0 and 1
          log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
          logPeriod: 100, // iterations between logging out --> number greater than 0
          learningRate: 0.01 // scales with delta to effect training rate --> number between 0 and 1
        })

        let testing = this.min_max(test)

        // let testData = test.map(d => {
        //   return { input: { sectors: this.normalize(d[1], testing.minIn, testing.maxIn) }, output: { idle: this.normalize(d[2], testing.minOut, testing.maxOut) } }
        // })
        // let result = net.run(testData)
        // //
        //
        // debug('run', (result.idle * (testing.maxIn - testing.minIn)) + testing.minIn)
        //
        // let forecast = [1000, 5000, 10000]
        // let forecastData = forecast.map(d => {
        //   return { input: { sectors: this.normalize(d[1], testing.minIn, testing.maxIn) } }
        // })
        //
        // let forecastResult = net.forecast(forecastData, 3)
        //
        // debug('forecastResult', (forecastResult.idle * (testing.maxIn - testing.minIn)) + testing.minIn)
        // this.$nextTick(function () {
        //
        // })

        let forecast = [1000, 5000, 100000]
        let forecastData = forecast.map(d => {
          return { input: { sectors: this.normalize(d, testing.minIn, testing.maxIn) } }
        })

        debug('forecastData', forecastData)

        let result = net.run(forecast)

        debug('run', (result.idle * (testing.maxIn - testing.minIn)) + testing.minIn)

        result = net.forecast(forecast, 3)

        debug('run', (result.idle * (testing.maxIn - testing.minIn)) + testing.minIn)
        //
      }
    }
  },
  mounted: function () {
    if (document.readyState !== 'loading') {
      this.run()
    } else {
      document.addEventListener('DOMContentLoaded', this.run)
    }
  },

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
    run: function () {
      document.getElementById('network-settings').addEventListener('submit', function (e) {
        // Stop it from submitting
        e.preventDefault()
        const networkType = this.elements.namedItem('network-type').value
        const size = this.elements.namedItem('size').value
          .split(',')
          .map((item) => {
            return parseInt(item, 10)
          })

        const config = {
          inputSize: size[0],
          inputRange: size[0],
          hiddenLayers: size.slice(1, size.length - 1),
          outputSize: size[size.length - 1]
        }

        const networkTypes = {
          NeuralNetwork: () => {
            return new brain.NeuralNetwork(config)
          },
          RNN: () => {
            return new brain.recurrent.RNN(config)
          },
          RNNTimeStep: () => {
            return new brain.recurrent.RNNTimeStep(config)
          },
          FeedForward: () => { // constructor shim
            const { input, feedForward, target } = brain.layer
            return new brain.FeedForward({
              inputLayer: () => input({ height: config.inputSize }),
              hiddenLayers: config.hiddenLayers.map((l) => (inputLayer) => feedForward({ height: l }, inputLayer)),
              outputLayer: inputLayer => target({ height: config.outputSize }, inputLayer)
            })
          },
          Recurrent: function () { // constructor shim
            const { input, recurrent, output } = brain.layer
            return new brain.Recurrent({
              inputLayer: () => input({ height: config.inputSize }),
              hiddenLayers: config.hiddenLayers.map((layerHeight) => {
                return (inputLayer, recurrentInput) => {
                  return recurrent({ height: layerHeight }, inputLayer, recurrentInput)
                }
              }),
              outputLayer: inputLayer => output({ height: config.outputSize }, inputLayer)
            })
          }
        }

        const options = constructOptions(this)
        const network = networkTypes[networkType](config)
        document.getElementById('result').innerHTML = this.elements.namedItem('use-json').checked
          ? brain.utilities.toSVG(network.toJSON(), options)
          : brain.utilities.toSVG(network, options)
      })

      function constructOptions (form) {
        return {
          height: Number(form.elements.namedItem('height').value),
          width: Number(form.elements.namedItem('width').value),
          radius: Number(form.elements.namedItem('radius').value),
          line: {
            width: Number(form.elements.namedItem('line-width').value),
            color: form.elements.namedItem('line-color').value
          },
          inputs: {
            color: form.elements.namedItem('inp-color').value,
            labels: (form.elements.namedItem('inp-labels').value || '').split(',')
          },
          hidden: {
            color: form.elements.namedItem('hid-color').value
          },
          outputs: {
            color: form.elements.namedItem('out-color').value
          },
          recurrentLine: {
            color: form.elements.namedItem('recurrent-line-color').value
          },
          fontSize: form.elements.namedItem('font-size').value
        }
      }

      // Click programmatically
      document.getElementById('submit').click()
    },
    min_max: function (data) {
      let minIn, maxIn, minOut, maxOut
      Array.each(data, function (d) {
        let inPut = d[1]
        let outPut = d[2]
        minIn = (minIn === undefined || minIn > inPut) ? inPut : minIn
        maxIn = (maxIn === undefined || maxIn < inPut) ? inPut : maxIn

        minOut = (minOut === undefined || minOut > outPut) ? outPut : minOut
        maxOut = (maxIn === undefined || maxIn < outPut) ? outPut : maxOut
      })

      return { minIn, maxIn, minOut, maxOut }
    },
    normalize: function (value, min, max) {
      return (value - min) / (max - min)
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
