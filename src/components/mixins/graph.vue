<template>

  <component
    v-if="chart_init === true"
    v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
    :is="wrapper.type+'-wrapper'"
    :id="id"
    :ref="id"
    :EventBus="EventBus"
    :chart="chart"
    :chart_data="tabular.data"
    :chart_data_length="stat.length"
    v-bind="wrapper.props"
  >
  </component>

  <!-- v-scroll="scrolled" -->
  <!-- <div v-else :style="chart.style">
     <q-inner-loading :visible="chart_init !== true" class="absolute-center">
       <q-spinner-facebook :size="20" color="indigo"></q-spinner-facebook>
     </q-inner-loading>
  </div> -->

  <!-- <vueBarsWrapper v-else
    :chart="{
      options: {
        height: 40,
        gradient:['#6fa8dc', '#42b983'],
        barWidth: 2,
        growDuration: 1,
        strokeWidth: 0,
        padding: 0
      }
    }"
    :data="[1, 2, 5, 9, 5, 10, 3, 5, 8, 12, 1, 2, 5, 9, 5, 10, 3, 5, 8, 12, 1, 2, 5, 9, 5, 10, 3, 5, 8, 12]"
  /> -->

  <!-- v-observe-visibility="visibilityChanged" -->

</template>

<script>

import * as Debug from 'debug'

const debug = Debug('components:mixins:graph')
// debug_internals = Debug('components:mixins:graph:Internals'),
// debug_events = Debug('components:mixins:graph:Events')

import { frameDebounce } from 'quasar'

// import vueBarsWrapper from 'components/wrappers/vueBars'
import dygraphWrapper from 'components/wrappers/dygraph'
// import vueEasyPieChartWrapper from 'components/wrappers/vueEasyPieChart'
// // import jqueryKnobWrapper from 'components/wrappers/jqueryKnob'
// import highchartsVueWrapper from 'components/wrappers/highchartsVue'
// import vueOdometerWrapper from 'components/wrappers/vueOdometer'

// import easyPieChartWrapper from 'components/wrappers/easyPieChart'

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  // console.log('roundMilliseconds', d.getTime())
  return d.getTime()
}

export default {

  components: {
    // vueBarsWrapper,
    dygraphWrapper
    // vueEasyPieChartWrapper,
    // // jqueryKnobWrapper,
    // highchartsVueWrapper,
    // // easyPieChartWrapper
    // vueOdometerWrapper
  },

  tabular: {
    lastupdate: 0,
    data: []
  },

  focus: true,

  firt_update: false,

  __skiped: 0,
  __data_unwatcher: undefined,
  __chart_init: false,
  visible: true,
  // data: function () {
  //   return []
  // },

  props: {
    EventBus: {
      type: [Object],
      default: () => ({})
    },
    chart: {
      type: [Object]
      // default: () => ({})
    },
    // stat: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // type:{
    //   type: [String],
    //   default: 'dygraph'
    // },
    id: {
      type: [String],
      default: ''
    },
    wrapper: {
      type: [Object],
      default: () => ({
        type: 'dygraph',
        props: {}
      })
    },
    always_update: {
      type: [Boolean],
      default: () => (false)
    }
    // wrapper_props: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // merged: {
    //   type: [Boolean],
    //   default: false
    // }
  },

  watch: {
    '$q.appVisible': function (newVal, oldVal) {
      debug('$q.appVisible', newVal)
      this.$options.focus = newVal
    }

  },

  data () {
    return {
      tabular: { lastupdate: 0, 'data': [[]] },
      chart_init: false
    }
  },

  created () {
    debug('created', this.id, this.wrapper, this.chart, this.chart_data)

    /**
    * maybe set an app option to allow user to choose if its want to  NOT update graphs
    * when window.blur (loose focus it may be visible but not as primary window)
    * right now updates graphs if "appVisible" (even on not primary windows)
    **/
    // window.addEventListener('blur', function () {
    //   debug('$appVisible blur')
    //   this.$options.focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function () {
    //   debug('$appVisible focus')
    //   this.$options.focus = true
    // }.bind(this), false)

    this.create()
  },
  // mounted () {
  //   this.create()
  // },
  // updated () {
  //   this.create()
  // },
  destroyed () {
    this.destroy()
    // this.$delete(this.tabular, 'data')
    this.$off()
  },
  methods: {
    // scrolled: function (position) {
    //   debug('scrolled', this.id, position)
    //   // when this method is invoked then it means user
    //   // has scrolled the Page to 'position'
    //   //
    //   // 'position' is an Integer designating the current
    //   // scroll position in pixels.
    // }, // debounce for 200ms
    reset: function () {
      /// ///////console.log('chart.vue mixing reset', this.id, this.$refs[this.id])
      // this.$refs[this.id].reset()
      this.destroy()
      this.create()
    },
    create: function () {
      this.$options.__skiped = 0
      // console.log('graph.vue mixing create', this.id, this.$refs[this.id])
      if (this.$refs[this.id] && typeof this.$refs[this.id].create === 'function') { this.$refs[this.id].create() }
    },
    destroy: function () {
      /// ///////console.log('chart.vue mixing destroy', this.id)

      if (this.$options.__data_unwatcher) { this.$options.__data_unwatcher() }

      this.$options.tabular.data = [[]]

      this.$set(this.tabular, 'data', [[]])

      if (this.$refs[this.id] && typeof this.$refs[this.id].destroy === 'function') { this.$refs[this.id].destroy() }

      this.$options.__chart_init = false
    },
    __create_watcher: function (name, chart) {},
    update_chart_stat: function (name, data, inmediate) {
      inmediate = (inmediate !== undefined) ? inmediate : (this.$options.firt_update === false)
      this.$options.firt_update = true

      // debug('update_chart_stat', name, data, inmediate)

      // ////console.log('chart mixin update_chart_stat', name, this.$refs[this.id], this.$options.focus, this.$options.visible, data)

      // if(this.$options.focus == true && this.$options.visible == true && data.length > 0){
      // ////console.log('update_chart_stat visibility', this.id, data)

      if (data.length === 1) {
        this.$options.tabular.data.shift()
        this.$options.tabular.data.push(data[0])
      } else if (data.length > 0) {
        let splice = data.length
        let length = this.$options.tabular.data.length
        this.$options.tabular.data = data

        this.$options.tabular.data.splice(
          (splice * -1) - 1,
          length - splice
        )
      }

      this.$options.tabular.data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })

      debug('graph update_chart_stat skip', this.id, this.chart.skip, this.chart.interval)
      // console.log('graph update_chart_stat skip',this.chart.skip, this.chart.interval)

      if (
        this.chart.skip &&
          this.chart.skip > 0 &&
          inmediate !== true
      ) {
        // this.chart.interval = this.chart.skip
        let new_data = []

        Array.each(this.$options.tabular.data, function (row, index) {
          // if(index === 0)
          //   this.$options.__skiped = 0

          // if(
          //   index === 0
          //   // || (index ===  this.$options.tabular.data.length - 1 && (row[0] / this.chart.skip) === 0)
          //   // || index === this.$options.tabular.data.length - 1
          //   // || (row[0] % this.chart.skip) === 0
          //   || this.chart.skip -1 === this.$options.__skiped
          // ){
          //   // //console.log('chart mixin update_chart_stat Array', name, this.chart.skip, this.$options.__skiped)
          //   new_data.push(row)
          //
          //   // if(index != this.$options.tabular.data.length - 1)
          //   this.$options.__skiped = 0
          // }
          // else{
          //   // //console.log('chart mixin update_chart_stat Array ++', name, this.chart.skip, this.$options.__skiped)
          //   this.$options.__skiped++
          // }

          let timestamp = roundMilliseconds(row[0])
          // if(index % this.chart.skip === 0) new_data.push(row)
          if (index === 0 || timestamp + (this.chart.skip * 1000) >= this.$options.__skiped) {
            // debug('skiping', this.id, timestamp)
            new_data.push(row)
            this.$options.__skiped = timestamp
          }
        }.bind(this))

        this.$options.tabular.data = new_data
        // this.$options.tabular.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
      }

      /**
        * @config: this should be config options
        * this.$options.focus
        * this.$options.visible
        */

      // if(this.$options.visible === true){
      debug('always_update', this.id, this.always_update)

      if (
        this.always_update === true ||
        (inmediate && inmediate === true) ||
          (
            (this.$options.focus === true && this.$options.visible === true) &&
            (
              !this.chart.interval ||
              (Date.now() - ((this.chart.interval * 1000) - 200) >= this.$options.tabular.lastupdate) ||
              this.$options.tabular.lastupdate === 0
            )
          )

      ) {
        if (this.$refs[name] && typeof this.$refs[name].update === 'function' && this.$options.tabular.data.length > 0) {
          if (inmediate === true) {
            this.$refs[name].update(this.$options.tabular.data)
          } else {
            frameDebounce(this.$refs[name].update(this.$options.tabular.data))
          }
        } else {
          if (inmediate === true) {
            this.$set(this, 'tabular', this.$options.tabular)
          } else {
            frameDebounce(this.$set(this, 'tabular', this.$options.tabular))
          }
        }
        debug('graph update_chart_stat updating', this.id, this.tabular.data.length, this.$options.tabular.data.length)

        this.$options.tabular.data = [[]]

        if (inmediate === true) {
          this.$options.tabular.lastupdate = 0
        } else {
          this.$options.tabular.lastupdate = Date.now()
        }
        // //console.log('graph.vue update', this.id, this.chart.interval, new Date(this.$options.tabular.lastupdate), inmediate)
      }

      // }
    },
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
    //   // this.$options.visible = isVisible
    //   if(
    //     isVisible == false
    //     && (this.$options.visible == undefined || this.$options.visible == true)
    //   ){
    //     this.reset()
    //   }
    //   // else if (
    //   //   isVisible == true
    //   //   && this.available_charts[id]
    //   //   && (this.visibility[id] == undefined || this.visibility[id] == false)
    //   // ){
    //   //   this.$set(this.visibility, id, true)
    //   //   this.add_chart(this.available_charts[id], id)
    //   // }

      /**
      * update with current data is visibility changed from "unvisible" to visible
      **/
      let __visible = this.$options.visible
      this.$options.visible = isVisible
      if ((!__visible || __visible === false) && isVisible === true) {
        this.update_chart_stat(this.id, this.$options.tabular.data, true)
      }
    }
  }
}
</script>

<style scoped>
#reset-this-parent {
  all: initial;
  * {
    all: unset;
  }
}
</style>
