
<script>
import * as Debug from 'debug'
const debug = Debug('components:chart.tabular')
// debug_internals = Debug('components:chart.tabular:Internals'),
// debug_events = Debug('components:chart.tabular:Events')

// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
// let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

import graph from '@mixins/graph'
import stat from '@mixins/stat'

export default {
  mixins: [graph, stat],

  name: 'chart-tabular',

  type: 'tabular',

  methods: {
    create () {
      debug('create', this.id)
      /// ///console.log('create chart.tabular', this.id, this.chart)

      // if(this.$refs[this.id] && typeof this.$refs[this.id].create === 'function')
      //   this.$refs[this.id].create()

      this.$options.tabular = {
        lastupdate: 0,
        data: []
      }

      // let unwatch = this.$watch('stat_data', function (val, old) {
      //   // //////console.log('create chart.tabular', val)
      //   // if(val && val.length > 1){
      //   if(val){
      //     // if(this.$options.__chart_init === false){
      //     if(this.chart_init === false){
      //
      //       // this.__create_watcher(this.id)
      //       this.__process_chart(this.chart, this.id)
      //       // this.$options.__chart_init = true
      //
      //
      //     }
      //
      //
      //     unwatch()
      //   }
      //
      // }, { deep: true } )

      // this.$on('stat_data', this.__first_stat_data_event.bind(this))
      // this.$on('stat_data', this.__first_stat_data_event.bind(this))
    },
    // __first_stat_data_event: function (val) {
    //
    //   if(val){
    //
    //     if(this.chart_init === false){
    //       // this.__process_stat(this.chart, this.id, val)
    //       this.__process_chart(this.chart, this.id)
    //     }
    //
    //     this.$off('stat_data', this.__first_stat_data_event)
    //   }
    // },
    __update_data: function (data) {
      if (data) {
        let inmediate = false
        if (this.chart_init === false) {
          // this.__process_stat(this.chart, this.id, val)
          this.__process_chart(this.chart, this.id)
          inmediate = true
        }

        let current = []
        Array.each(data, function (row) {
          // if you are not using buffer, you are managing your data, you are in charge of fixing values
          if (this.no_buffer === false) {
            // fix for incorrect values like "" (empty)
            if (Array.isArray(row.value)) {
              Array.each(row.value, function (value, index) {
                value = (value) ? value * 1 : 0 // int cast
                row.value[index] = value
                // if (!value || isNaN(value)) { row.value[index] = 0 } // or should be undefined?
              })
            }
          }

          current.push(row.value)
        }.bind(this))

        // debug('__create_watcher->generic_data_watcher',this.id, current, inmediate)
        debug('__update_data %s %o %o', this.id, data, this.chart_init, this.no_buffer, inmediate)

        this.update_chart_stat(this.id, current, inmediate)
      }
    },
    __process_chart (chart, name, stat) {
      debug('__process_chart', this.id)
      /// /console.log('__process_chart', this.$options.stat_data, name, stat)

      if (chart.init && typeof chart.init === 'function') {
        chart.init(this, chart, name, stat, 'chart')
        this.$set(this, 'chart_init', true)
      } else {
        this.$set(this, 'chart_init', true)
      }

      // this.__create_watcher(name, chart)
    }
    // __create_watcher(name, chart){
    //
    //
    //   let generic_data_watcher = function(current, inmediate){
    //     // console.log('chart.tabular generic_data_watcher', current)
    //     // if(current && this.$options.visible){
    //      if(current){
    //       let data = []
    //       Array.each(current, function(row){
    //         //fix for incorrect values like "" (empty)
    //         if(Array.isArray(row.value))
    //           Array.each(row.value, function(value, index){
    //             if(!value || isNaN(value))
    //               row.value[index] = 0 //or should be undefined?
    //           })
    //
    //
    //         data.push(row.value)
    //       })
    //
    //       debug('__create_watcher->generic_data_watcher',this.id, data, inmediate)
    //
    //       this.update_chart_stat(this.id, data, inmediate)
    //
    //     }
    //   }.bind(this)
    //
    //   // ////////console.log('gonna watch...', name, this.stat.data)
    //
    //   /**
    //   * first update
    //   **/
    //   if(this.$options.stat_data[0] && this.$options.stat_data[0].value)
    //     generic_data_watcher(this.$options.stat_data, true)//inmediate update
    //
    //   // this.$options.__data_unwatcher = this.$watch('stat_data', generic_data_watcher)
    //   this.$on('stat_data', generic_data_watcher)
    // },

  }
}
</script>
