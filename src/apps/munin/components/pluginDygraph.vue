<template>
  <!-- <Widget
    v-if="config && processed_data.length > 0"
    class="bg-transparent"
    :title="'<h5>Plugin <span class=\'fw-semi-bold\'>&nbsp;'+title+'</span></h5>'"
    settings refresh close customHeader
  > -->
    <!-- <p>Status: <strong>Live</strong></p> -->
    <!-- <div v-if="config && processed_data.length > 0"> -->

     <!-- && processed_data.length > 0 -->

   <!-- We use class hidden and not a v-if, becasue they need to be created to be used with their "$refs"-->
    <vk-card v-if="config" :class="(show === false) ? 'uk-background-secondary uk-light hidden': 'uk-background-secondary uk-light'">
      <vk-card-title>
        <h4 class="uk-light">{{title}}</h4>
      </vk-card-title>

      <p>{{info}}</p>
      <p v-if="show_minute">
        <q-checkbox v-model="view.minute" label="Minute" />
        <!-- :disable="!data.minute"  -->
        <!-- <span class="circle bg-warning text-white"><i class="fa fa-hashtag" /></span> &nbsp; -->
        <!-- {{count}} -->
      </p>

      <!--
      DON'T REMOVE -> :key="view.minute"
      needed so component is recreated on key change, so a new Dygraph chart is created with new labels / columns
      -->
      <component
        :is="tabular === false ? 'chart' : 'chart-tabular'"
        :wrapper="{
          type: 'dygraph'
        }"
        :always_update="false"
        :ref="id"
        :id="id"
        :key="view.minute"
        :EventBus="eventbus"
        :stat="{
          data: [],
          length: 192,
        }"
        :chart="chart"
      >
      <!-- data: [processed_data] -->
      <!-- stat -> length: 300, -->
      <!-- :key="view.minute" -->
      <!-- :always_update="true" re check this, what was used for?-->
      </component>
    </vk-card>
    <!-- </div> -->
  <!-- </Widget> -->
</template>

<script>
// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:components:pluginDygraph')

import { EventBus } from '@libs/eventbus'

// import chart from '@components/chart'
import chartTabular from '@components/chart.tabular'

import dygraph_line_chart from 'mngr-ui-admin-charts/defaults/dygraph.line'

// // import AdminLteMixin from '@components/mixins/adminlte'
// import DataSourcesMixin from '@components/mixins/dataSources'
//
// import GridView from '@components/gridView'
//
// // import Test from '@components/test/test.vue'
//
// import Pipeline from 'js-pipeline'
// import Pipeline from '../pipelines/index'
//

// let moment = require('moment')

// import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
// import StatsCard from '@apps/munin/components/creativetim/argon/StatsCard'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

const MAX_FEED_DATA = 10

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const roundSeconds = function (timestamp) {
  timestamp = roundMilliseconds(timestamp)
  let d = new Date(timestamp)
  d.setSeconds(0)

  return d.getTime()
}

const roundMinutes = function (timestamp) {
  timestamp = roundSeconds(timestamp)
  let d = new Date(timestamp)
  d.setMinutes(0)

  return d.getTime()
}
const roundHours = function (timestamp) {
  timestamp = roundMinutes(timestamp)
  let d = new Date(timestamp)
  d.setHours(0)

  return d.getTime()
}

const SECOND = 1000
const MINUTE = 60 * SECOND

export default {
  // mixins: [DataSourcesMixin],

  name: 'muninPluginDygraph',
  // components: { GridView, Widget, StatsCard },
  components: { chartTabular },

  // pipelines: {},
  props: {
    id: {
      type: String,
      default: undefined
    },
    tabular: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: function () { return {} }
    },
    config: {
      type: Object,
      default: function () { return undefined }
    }
  },

  __config_set: false,
  plugin_data: undefined,

  data () {
    return {
      // id: 'all',
      path: 'all',

      view: {
        minute: false
      },
      processed_data: [],
      show: false,
      show_minute: false,

      eventbus: EventBus,
      chart: Object.merge(Object.clone(dygraph_line_chart), { interval: 5 })

    }
  },
  watch: {
    'view.minute': function (val) {
      debug('VIEW MINUTE %o', val, this.id)
      // let options = JSON.parse(JSON.stringify(this.chart.options))
      let data = JSON.parse(JSON.stringify(this.data))

      this.$options.__config_set = false

      this.__process_data(data)
      // this.processed_data = data
      // this.chart.options = options
    }
    // 'data.periodical': {
    //   handler: function (val) {
    //     // this.__process_data(val)
    //     let data = JSON.parse(JSON.stringify(this.data))
    //     this.__process_data(data)
    //   }
    //   // deep: true
    // }
    // 'data': {
    //   handler: function (val) {
    //     this.__process_data(val)
    //   },
    //   deep: true
    // }
  },

  methods: {
    // update: function (val) {
    //   debug('update method', this.id)
    // },
    set_data: function (data) {
      // debug('set_data', this.id, data)
      this.$options.plugin_data = Object.merge(this.$options.plugin_data, data)

      if (this.$options.plugin_data.periodical) {
        let splice = 192 // 12 points per min * 16 min
        let length

        Object.each(this.$options.plugin_data.periodical, function (periodical, key) {
          length = periodical.length
          this.$options.plugin_data.periodical[key].splice(
            (splice * -1) - 1,
            length - splice
          )
        }.bind(this))
      } else if (this.$options.plugin_data.minute) {
        let splice = 16 // 1 points per min * 16 min
        let length

        Object.each(this.$options.plugin_data.minute, function (minute, key) {
          length = minute.length
          this.$options.plugin_data.minute[key].splice(
            (splice * -1) - 1,
            length - splice
          )
        }.bind(this))
      }

      debug('set_data2', this.id, this.$options.plugin_data)

      this.__process_data(this.$options.plugin_data)
    },
    __process_data: function (val) {
      if (this.config && Object.getLength(this.config) > 0) {
        val = JSON.parse(JSON.stringify(val))

        if (val.periodical && Object.getLength(val.periodical) > 0) {
          // debug('data watch %s %o', this.id, JSON.parse(JSON.stringify(this.config)), JSON.parse(JSON.stringify(val.periodical)))

          let periodical = val.periodical
          let minute = val.minute

          if (minute && Object.getLength(minute) > 0) {
            this.show_minute = true
          }

          debug('data watch show_minute %s %o', this.id, this.show_minute)

          if (this.$options.__config_set === false) { this.$set(this.chart.options, 'labels', ['Time']) }
          // this.$set(this.chart.options, 'sigFigs', 6)

          if (this.view.minute === false && this.config.graph && this.config.graph.args && this.$options.__config_set === false) {
            let args = this.config.graph.args.split(' ')
            Array.each(args, function (arg) {
              if (arg === '--logarithmic') { this.$set(this.chart.options, 'logscale', true) }
            }.bind(this))
          }

          let processed_data = []
          let negative_key
          let cdefs = []

          let index = 0
          Object.each(periodical, function (arr, key) {
            let key_config = this.config[key]
            if (!key_config) {
              Object.each(this.config, function (conf, conf_key) {
                if (conf_key.replace('_', '').replace('.', '') === key) {
                  key_config = conf
                }
              })
            }
            let label = (key_config && key_config.label) ? key_config.label : key

            if (this.$options.__config_set === false) { this.chart.options.labels.push(label) }

            debug('KEY %s %o', key, this.config)

            if (key_config.negative) { negative_key = key_config.negative.replace('_', '') }

            if (key_config.cdef) { cdefs.push(key_config.cdef) }

            /**
            * if at least one is STAKED, dygraph.options.stackedGraph === true
            **/
            if (this.$options.__config_set === false) {
              if (this.view.minute === false) {
                this.$set(this.chart.options, 'stackedGraph', (this.chart.options.stackedGraph && this.chart.options.stackedGraph === true)
                  ? this.chart.options.stackedGraph
                  : !!((key_config && key_config.draw && key_config.draw === 'STACK'))
                )

                if (this.chart.options.stackedGraph === true) {
                  this.$set(this.chart.options, 'fillGraph', true)
                  this.$set(this.chart.options, 'fillAlpha', 0.5)
                }

                if (key_config.min) {
                  if (!this.chart.options.valueRange) {
                    this.$set(this.chart.options, 'valueRange', [])
                    this.$set(this.chart.options.valueRange, 0, key_config.min)
                  }

                  this.$set(this.chart.options.valueRange, 0,
                    (this.chart.options.valueRange &&
                       this.chart.options.valueRange[0] &&
                       this.chart.options.valueRange[0] * 1 < key_config.min
                    ) ? this.chart.options.valueRange[0] * 1 : key_config.min
                  )
                }

                if (key_config.max) {
                  if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
                  this.$set(this.chart.options.valueRange, 1, (this.chart.options.valueRange && this.chart.options.valueRange[1] && this.chart.options.valueRange[1] > key_config.max) ? this.chart.options.valueRange[1] : key_config.max)
                }
              } else {
                this.$set(this.chart.options, 'stackedGraph', false)
                this.$set(this.chart.options, 'fillGraph', false)

                this.$delete(this.chart.options, 'valueRange')
              }
            }

            // if (this.chart.options.logscale === true && this.chart.options.valueRange && this.chart.options.valueRange[0] === 0) {
            //   this.chart.options.valueRange[0] = 0.0000000000000001
            // }
            // debug('data watch STAKED %s %o', this.id, this.chart, key_config.draw)

            if (index === 0) {
              processed_data = Array.clone(arr)
              // Array.each(processed_data, function (row, i) {
              //   if (this.chart.options.logscale === true && arr[i][1] === 0) processed_data[i][1] = 0.0000000000000001
              // }.bind(this))
            } else {
              Array.each(processed_data, function (row, i) {
                let timestamp = row[0]
                if (arr[i][0] === timestamp) {
                  // arr[i][0] = undefined
                  // arr[i] = arr[i].clean()
                  // processed_data[i].combine(arr[i])
                  // if (this.chart.options.logscale === true && arr[i][1] === 0) arr[i][1] = 0.0000000000000001

                  processed_data[i].push(arr[i][1])
                }
                // else {
                //   processed_data[i].combine([timestamp, 0])
                // }
              })

              // let splice = 900 // 12 points per min * 16 min
              // let length = processed_data.length
              //
              // processed_data.splice(
              //   (splice * -1) - 1,
              //   length - splice
              // )
            }

            /**
            * 'munin_historical tabular' order
            * "timestamp": 0,
            * "max": 3966 ,
            * "mean": 3944 ,
            * "median": 3945 ,
            * "min": 3919 ,
            * "mode": 3919 ,
            * "range": 47 ,
            * "sum": 23664
            **/

            // debug('MINUTE %o', minute)

            if (this.view.minute === true && minute && minute[key] && Array.isArray(minute[key]) && minute[key].length > 0) {
              if (!this.chart.options.labels.contains(label + '(median)') && this.$options.__config_set === false) {
                this.chart.options.labels.push(label + '(median)')
              }

              let index = this.chart.options.labels.indexOf(label + '(median)')
              let last

              Array.each(processed_data, function (row, i) {
                let timestamp = row[0]
                let added_minute = false

                Array.each(minute[key], function (minute_row) {
                  let minute_row_timestamp = minute_row[0]
                  // debug('TIMESTAMPs %s %s', new Date(roundSeconds(minute_row_timestamp)), new Date(roundSeconds(timestamp)))

                  if (roundSeconds(minute_row_timestamp) === roundSeconds(timestamp) - MINUTE) {
                    processed_data[i][index] = minute_row[3] // median
                    added_minute = true
                  }

                  last = minute_row[3]
                })

                if (added_minute === false) { processed_data[i][index] = last }
              })
            }

            index++
          }.bind(this))

          if (this.view.minute === false) {
            Object.each(periodical, function (arr, key) {
              let key_config = this.config[key]

              if (!key_config) {
                Object.each(this.config, function (conf, conf_key) {
                  if (conf_key.replace('_', '').replace('.', '') === key) {
                    key_config = conf
                  }
                })
              }

              if (key_config.type && (key_config.type === 'DERIVE')) {
                let label = (key_config && key_config.label) ? key_config.label : key

                let index = this.chart.options.labels.indexOf(label)

                if (index > -1) {
                  let prev = 0
                  // Array.each(processed_data, function (row, i) {
                  for (let i = 0; i < processed_data.length; i++) {
                    let row = processed_data[i]

                    if (i === processed_data.length - 1) {
                      processed_data[i][index] = 0
                    } else {
                      /**
                      * ( (row[0] - processed_data[i + 1][0]) / 1000 )
                      * timestamp of row - timestamp of next row (decreasing timestamps) / 1000 = seconds between rows
                      **/
                      processed_data[i][index] = (row[index] - processed_data[i + 1][index]) / ((row[0] - processed_data[i + 1][0]) / 1000)
                    }

                  // })
                  }
                }

                // let median_index = this.chart.options.labels.indexOf(label + '(median)')
                //
                // if (median_index > -1) {
                //   let prev = 0
                //   // Array.each(processed_data, function (row, i) {
                //   for (let i = 0; i < processed_data.length; i++) {
                //     let row = processed_data[i]
                //
                //     if (i === processed_data.length - 1) {
                //       processed_data[i][median_index] = 0
                //     } else {
                //       processed_data[i][median_index] = row[median_index] - processed_data[i + 1][median_index]
                //     }
                //
                //   // })
                //   }
                // }
              }
            }.bind(this))
          }
          /**
          * now that we now if there is a negative key, find it and make values negative
          **/
          if (negative_key) {
            // index = 0
            // Object.each(periodical, function (arr, key) {
            // if (negative_key === key) {
            let key_config = this.config[negative_key]

            if (!key_config) {
              Object.each(this.config, function (conf, conf_key) {
                if (conf_key.replace('_', '').replace('.', '') === negative_key) {
                  key_config = conf
                }
              })
            }

            if (key_config.max && this.chart.options.valueRange && this.$options.__config_set === false) {
              // if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
              this.$set(this.chart.options.valueRange, 0, (this.chart.options.valueRange && this.chart.options.valueRange[0] && this.chart.options.valueRange[0] < (key_config.max * -1)) ? this.chart.options.valueRange[0] : (key_config.max * -1))
            }

            let label = (key_config && key_config.label) ? key_config.label : negative_key

            let index = this.chart.options.labels.indexOf(label)

            if (index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][index] = row[index] * -1
              })
            }

            let median_index = this.chart.options.labels.indexOf(label + '(median)')

            if (median_index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][median_index] = row[median_index] * -1
              })
            }
            // }
            // }.bind(this))
          }

          /**
          * process cdefs
          **/
          if (this.view.minute === false) {
            let cdef_data = function (cdef, value) {
              let num = cdef.split(',')[1]
              let op = cdef.split(',')[2]
              // debug('cdef VALUE OP NUM %s %s %s', value, op, num)
              switch (op) {
                case '/': return value / num
                case '*': return value * num
                default: return value
              }
            }

            Array.each(cdefs, function (cdef) {
              if (cdef.split(',').length === 3) {
                let cdef_key = cdef.split(',')[0]

                let key_config = this.config[cdef_key]
                let label = (key_config && key_config.label) ? key_config.label : negative_key

                let index = this.chart.options.labels.indexOf(label)

                if (index > -1) {
                  Array.each(processed_data, function (row, i) {
                    processed_data[i][index] = cdef_data(cdef, row[index])
                    // debug('cdef data %d %d', processed_data[i][index], row[index])
                  })
                }

                // let median_index = this.chart.options.labels.indexOf(label + '(median)')
                //
                // if (median_index > -1) {
                //   Array.each(processed_data, function (row, i) {
                //     processed_data[i][median_index] = cdef_data(cdef, row[median_index])
                //   })
                // }
              }
            }.bind(this))
          }

          if (this.chart.options.labels.length > 10 && this.$options.__config_set === false) {
            let extra_rows = this.chart.options.labels.length - 10
            let height = 154 + (15 * extra_rows)
            this.chart.style = 'width:100%; height:' + height + 'px;'
          }

          if (this.chart.options.valueRange === null && this.chart.options.logscale === true && this.$options.__config_set === false) {
            this.$set(this.chart.options, 'valueRange', [0.0000000000000001])
          }

          if (this.chart.options.valueRange && !this.chart.options.valueRange[0] && this.$options.__config_set === false) {
            this.$set(this.chart.options.valueRange, 0, (this.chart.options.logscale === true) ? 0.0000000000000001 : 0)
          }

          // if (this.id === 'munin.diskstats.diskstats.latency.vol0_home') {
          //   debug('munin.diskstats.diskstats.latency.vol0_home %o %o %o %o', this.id, val, this.config, this.chart.options)
          // }

          debug('processed_data REFS %s %o', this.id, this.$refs)

          // this.processed_data = processed_data
          this.$refs[this.id].update_stat_data([processed_data])
          this.$options.__config_set = true
          this.show = true
        } else {
          debug('No data for %s %o', this.id, val)
        }
      }
    }
  //
  //   /**
  //   * @start pipelines
  //   **/
  //   create_pipelines: function (next) {
  //     debug('create_pipelines')
  //
  //     let template = Object.clone(Pipeline)
  //
  //     let pipeline_id = template.input[0].poll.id
  //
  //     template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
  //
  //     let pipe = new JSPipeline(template)
  //
  //     this.$options.__pipelines_cfg[pipeline_id] = {
  //       ids: [],
  //       connected: [],
  //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
  //     }
  //
  //     this.__after_connect_inputs(
  //       pipe,
  //       this.$options.__pipelines_cfg[pipeline_id],
  //       this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
  //         debug('__resume_pipeline CALLBACK')
  //         pipe.fireEvent('onOnce')
  //       }], this)
  //     )
  //
  //     this.$options.pipelines[pipeline_id] = pipe
  //
  //     if (next) { next() }
  //   }
  //
  //   /**
  //   * @end pipelines
  //   **/
  //
  },
  computed: {
    title: function () {
      return (this.config.graph && this.config.graph.title) ? this.config.graph.title : this.id
    },
    info: function () {
      return (this.config.graph && this.config.graph.info) ? this.config.graph.info : ''
    }
  },
  mounted: function () {
    debug('mounted')
  }

}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}

.netdata-dygraph-chart {

}
.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-legend {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-axis-label {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
