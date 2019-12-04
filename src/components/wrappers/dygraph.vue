<template>
  <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
    :style="chart.style"
  >
  <!-- v-observe-visibility="visibilityChanged" -->
     <div
       :ref="id"
       :id="id"
       :class="chart.class"
     >

    </div>
    <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div>
  </div>
</template>

<script>
/* global smoothPlotter */

import * as Debug from 'debug'

const debug = Debug('components:wrappers:dygraph')
// debug_internals = Debug('components:wrappers:dygraph:Internals'),
// debug_events = Debug('components:wrappers:dygraph:Events')

import chartMixin from '@mixins/chart.vue'

import Dygraph from 'dygraphs'
import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

export default {
  mixins: [chartMixin],

  name: 'dygraph-wrapper',

  chart_options: {},
  __unwatch_options: undefined,
  __unwatch_smooth: undefined,

  props: {
    // EventBus: {
    //   type: [Object],
    //   default: () => ({})
    // }
    smoothness: {
      type: [Boolean],
      default: false
    }
  },

  watch: {
    'smoothness': function (val, old) {
      debug('smoothness', this.id, val)
      // if (val && Object.getLength(val) > 0 && val.options) {
      this.__chart_destroy()
      this.__chart_create()
    }
  },
  created () {
    let self = this
    if (self.EventBus && typeof (self.EventBus.$on) === 'function') {
      self.EventBus.$on('highlightCallback', params => {
        self.highlighted = true
      })
      self.EventBus.$on('unhighlightCallback', event => {
        self.highlighted = false
      })
    }
  },
  // mounted () {
  //
  //   // if(this.$options.graph === null && this.chart_data && this.chart_data.length > 1){
  //   //
  //   //   this.__chart_create()
  //   //
  //   // }
  //   // this.__watcher()
  //
  //   this.create()
  //   // if(this.chart && this.chart.options){
  //   //   //console.log('mounted dygraph', this.id, this.chart)
  //   //   this.create()
  //   // }
  //   // else{
  //   //   let unwatch = this.$watch('chart', function(val){
  //   //     if(val && Object.getLength(val) > 0 && val.options){
  //   //       // this.__chart_create()
  //   //       this.create()
  //   //       unwatch()
  //   //     }
  //   //
  //   //   })
  //   // }
  // },
  // updated () {
  // //
  // //   // if(this.$options.graph === null && this.chart_data && this.chart_data.length > 1){
  // //   //
  // //   //   this.__chart_create()
  // //   //
  // //   // }
  // //   // this.__watcher()
  // //
  //   this.create()
  // },
  // destroyed (){
  //   this.destroy()
  //   if(this.$options.graph && typeof this.$options.graph.destroy === 'function'){
  //     this.$options.graph.destroy()
  //
  //   }
  //
  //   this.$options.graph = undefined
  //   this.$off()
  // },
  methods: {

    /**
    * UI related
    **/
    // reset: function(){
    //   this.destroy()
    //   this.create()
    // },
    destroy: function () {
      /// /////console.log('dygraph destroy', this.id)

      this.__chart_destroy()

      if (this.$options.__unwatcher) {
        this.$options.__unwatcher()
        this.$options.__unwatcher = undefined
      }

      if (this.$options.__unwatch_options) {
        this.$options.__unwatch_options()
        this.$options.__unwatch_options = undefined
      }
    },
    __chart_destroy () {
      if (this.$options.graph && typeof this.$options.graph.destroy === 'function') {
        // //////////console.log('destroying ...', this.id)
        this.$options.graph.destroy()
      }

      this.$options.graph = undefined
      this.ready = false
    },
    create () {
      // console.log('create dygraph', this.id, this.chart)

      if (this.chart && this.chart.options) {
        // this.create()
        this.__chart_create()
      } else {
        let unwatch = this.$watch('chart', function (val) {
          if (val && Object.getLength(val) > 0 && val.options) {
            this.__chart_destroy()
            this.__chart_create()
            // this.create()
            unwatch()
          }
        })
      }

      // this.$options.__unwatch_smooth = this.$watch('chart.smooth', function (val) {
      //   debug('chart.smooth', this.id, val)
      //   // if (val && Object.getLength(val) > 0 && val.options) {
      //   this.__chart_destroy()
      //   this.__chart_create()
      //   // this.create()
      //   // unwatch()
      //   // }
      // }, { deep: true })
    },
    __chart_create () {
      // let unwatch_options = this.$watch('chart.options', function(val){
      //   // if(val && Object.getLength(val) > 0 && val.options){
      //   //   this.__chart_create()
      //   //   // this.create()
      //   //   unwatch()
      //   // }
      //   console.log('dygraph chart.options watcher', val)
      // }, {deep: true})
      this.$options.chart_options = Object.clone(this.chart.options)
      this.$options.__unwatch_options = this.$watch('chart.options', function (val) {
        // // if(val && Object.getLength(val) > 0 && val.options){
        // //   this.__chart_create()
        // //   // this.create()
        // //   unwatch()
        // // }
        // console.log('dygraph chart.options watcher', val.labels)
        this.$options.chart_options = Object.clone(val)
      }, { deep: true })

      // console.log('__chart_create', this.id, this.$options.chart_options)

      if (this.$options.chart_options.labels && document.getElementById(this.id)) {
        if (this.$options.chart_options.labelsDiv) { this.$options.chart_options.labelsDiv = this.id + '-' + this.$options.chart_options.labelsDiv }

        let data = []
        if (this.chart_data[0] && this.chart_data[0].length === 0) {
          let row = []
          Array.each(this.$options.chart_options.labels, function (label) {
            row.push(0)
          })
          data.push(row)
        } else {
          data = this.get_data()
          // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // data = []
        }

        // Array.each(this.chart_data, function(row){
        //   row[0] = new Date(row[0])
        //   data.push(row)
        // })

        // console.log('__chart_create', this.id, this.$options.chart_options)

        /**
        * should add an option for general smooth plotting (true | false)
        **/
        if (this.$options.chart_options.fillGraph !== true && this.smoothness === true) { this.$options.chart_options.plotter = smoothPlotter }

        /**
        * seting 'ticker' is a really performance improvement
        **/
        if (!this.$options.chart_options.axes || this.$options.chart_options.axes.x || this.$options.chart_options.axes.x.ticker) {
          this.$options.chart_options = Object.merge(this.$options.chart_options, {
            axes: {
              x: {
                ticker: Dygraph.dateTicker
              }
            }
          })
        }

        this.$options.graph = new Dygraph(
          document.getElementById(this.id), // containing div
          data,
          this.$options.chart_options
        )

        debug('__chart_create', this.id, this.$options.chart_options, data)

        this.$options.graph.ready(function () {
          // //////////////console.log('chart '+this.id+' ready')
          debug('__chart_create ready', this.id)
          this.ready = true
          // this.update()
        }.bind(this))

        if (this.chart.init) { this.chart.init(this, this.$options.graph, 'dygraph') }

        // this.update()
      }
    },
    get_data: function (data) {
      data = data || Array.clone(this.chart_data)
      data = JSON.parse(JSON.stringify(data))

      data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })

      Array.each(data, function (row) {
        if (row) { row[0] = new Date(row[0]) }
        // data.push(row)
      })

      return data
    },
    update (data) {
      data = this.get_data(data)
      debug('update', this.id, this.ready, data, this.$options.chart_options.labels)
      // let options = (this.ready === true && this.$options.graph.numRows() > 1) ? { 'dateWindow': this.$options.graph.xAxisExtremes() } : {}
      // if(this.$options.visible === true && this.ready === true){
      if (this.ready === true && data && data[0]) {
        // //console.log('updateOptions', this.id, data)

        // this.updateOptions(
        //   data,
        //   Object.merge(this.$options.chart_options, { 'dateWindow': this.$options.graph.xAxisExtremes() }),
        //   false
        // )

        let end = data[data.length - 1][0]
        let start
        if (!this.chart_data_length) {
          start = data[0][0]
        } else {
          start = end - (this.chart_data_length * 1000)
        }

        debug('update start - end', this.chart_data_length, start, end)

        this.updateOptions(
          data,
          Object.merge(Object.clone(this.$options.chart_options), { 'dateWindow': [start, end] }),
          false
        )
      }
    },
    updateOptions (data, options, block_redraw) {
      // debug('updateOptions', this.id, this.ready)
      // let self = this

      if (
        this.highlighted === false &&
        this.ready === true
        // && this.data.length > 1
        // && this.data[0].length > 1
        // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
        // && this.freezed === false
      ) {
        // if(self.data[0][0] === undefined && self.chart.options && self.chart.options.labels)//dygraph code, should be would
        //   Array.each(self.chart.options.labels, function(label, index){
        //     if(index === 0){
        //       self.data[0].push(Date.now())
        //     }
        //     else{
        //       // data[0].push(0)
        //       self.data[0].push(null)
        //     }
        //
        //   })

        /**
          * should be sorted already
          **/
        // if(this.chart.skip > 0)
        //   data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

        // let data = []
        // console.log('updateOptions', data, options)

        this.$options.graph.updateOptions(
          Object.merge(
            {
              'file': data
            },
            options
          ),
          block_redraw
        )

        // this.$options.graph.updateOptions(
        //   { 'dateWindow': this.$options.graph.xAxisExtremes() },
        //   block_redraw
        // );
        let selection = (this.chart.skip && this.chart.skip > 0) ? this.chart.skip : 1

        debug('updateOptions selection', data.length, selection)

        this.$options.graph.setSelection(this.$options.graph.numRows() - selection, {}, false)
      }
    }
  }
}
</script>
