
<script>

import * as Debug from 'debug'

const debug = Debug('components:mixins:stat')
// debug_internals = Debug('components:mixins:stat:Internals'),
// debug_events = Debug('components:mixins:stat:Events')

// import PouchDB from 'pouchdb'
// import PouchDBFind from 'pouchdb-find'
// PouchDB.plugin(PouchDBFind)

// import statStore from 'src/store/stat'

export default {

  components: {
  },

  /**
  * set/modified by graph.vue or your own logic
  **/
  // focus: true,
  visible: true,

  __range_init: false,
  __stat_unwatcher: undefined,
  __buffer_data: [], // array to save individual stats until we fill in with ranges

  root: undefined,
  path: undefined,
  key: undefined,

  // length: undefined,

  props: {
    EventBus: {
      type: [Object],
      default: () => ({})
    },
    stat: {
      type: [Object],
      default: () => ({
        range: [],
        length: undefined,
        // interval: 1, // in seconds
        merged: false,
        data: [],
        sources: undefined
      })
    },
    // type:{
    //   type: [String],
    //   default: 'dygraph'
    // },
    dashboard: {
      type: [String],
      default: undefined
    },
    id: {
      type: [String],
      default: ''
    },
    // wrapper_props: {
    //   type: [Object],
    //   default: () => ({})
    // },

    /**
    * if you send the complete data set on each update, set this to true,
    * else it appends data to a buffer
    **/
    no_buffer: {
      type: [Boolean],
      default: false
    }
  },

  stat_data: [],

  data () {
    return {
      stat_lastupdate: 0
      // stat_data: []
    }
  },
  // computed: mapState({
  //
  //   // to access local state with `this`, a normal function must be used
  //   sources (state) {
  //     let data = []
  //     if(!Array.isArray(this.stat.sources))
  //       this.stat.sources = [this.stat.sources]
  //
  //     Array.each(this.stat.sources, function(source, index){
  //       let {type, path} = source
  //       //console.log('this.stat.data', type, path)
  //       data.push(this.$store.state[type+'_sources'][path])
  //     }.bind(this))
  //     return data
  //   }
  // }),
  watch: {
    'stat.range': {
      handler: function (newVal, oldVal) {
        // if(newVal) {this.$store.registerModule('dashboard_'+newVal, Object.clone(dashboardStore))}
        if (newVal && oldVal && !newVal.every(function (val, index) { return val === oldVal[index] })) {
          debug('new range', newVal, oldVal)
          this.__change_range(newVal)
        }
      }
      // deep: true
    }
  },
  created () {
    this.$options.__buffer_data = []

    this.$options.stat_data = []

    // const DATA_LENGTH = (this.stat && this.stat.data) ? this.stat.data.length : 0
    let range_length = (this.stat.range && this.stat.range[1] && this.stat.range[0]) ? (this.stat.range[1] - this.stat.range[0]) / 1000 : undefined
    if (range_length === undefined || range_length <= 1) { this.$options.__range_init = true }

    this.stat.length = this.stat.length || range_length
    // this.$options.length = this.stat.length || range_length

    this.$options.root = this.id.split('.')[0]
    this.$options.path = this.id.split('.')[1]
    // this.$options.key = this.id.split('.')[2]
    this.$options.key = this.id.substring(this.id.lastIndexOf('.') + 1)

    /// /console.log('stat.vue id', this.id, this.$options.type)
    /**
    * @test - no local data
    **/
    //   if (!this.$store.state[this.$options.type][this.id]) {
    //     this.$store.registerModule([this.$options.type, this.id], Object.clone(statStore))
    //     this.$store.commit(this.$options.type + '/' + this.id + '/id', this.id)
    //     this.$store.commit(this.$options.type + '/' + this.id + '/type', this.$options.type)
    //     /** new PouchDB(
    //   this.$options.type+'_'+this.$options.root+'_'+this.$options.path+'_'+this.$options.key,
    //   {adapter: 'memory'}
    // )**/
    //     let db = new PouchDB(
    //       // this.$options.type+'_'+this.$options.path+'_'+this.$options.key
    //       this.$options.type + '_' + this.$options.root + '_' + this.$options.path + '_' + this.$options.key
    //     )
    //     db.createIndex({
    //       'index': {
    //         // "fields": ['metadata.host', 'metadata.timestamp'],
    //         'fields': ['metadata.timestamp'],
    //         'ddoc': 'mango_search',
    //         'name': 'timestamp'
    //       }
    //     }).then(function (result) {
    //       // console.log('creating index', result)
    //     })
    //
    //     this.$store.commit(this.$options.type + '/' + this.id + '/db', db)
    //   }
    /**
    * @test - no local data
    **/

    debug('stat.vue data', this.id, this.stat.data, this.stat.range, this.stat.length)

    if (this.stat.range && this.stat.length > 1) {
      // this.$store.dispatch(this.$options.type+'/'+this.id+'/get', {
      //   root: this.$options.root,
      //   path: this.$options.path,
      //   key: this.$options.key,
      //   length: this.stat.length,
      //   range: this.stat.range
      // }).then((docs) => {
      //   /**
      //   * @testing - avoid locals
      //
      //   **/
      //   // let new_docs_range = this.__get_new_range([], JSON.parse(JSON.stringify(this.stat.range)))
      //   let new_docs_range = this.__get_new_range(docs, JSON.parse(JSON.stringify(this.stat.range)))
      //   docs = new_docs_range.docs
      //   let range = new_docs_range.range
      //
      //
      //   if(docs.length > 0){
      //     // ////console.log('stats/get', docs, range)
      //
      //     let stats = []
      //     Array.each(docs, function(doc){
      //       if(doc && doc.data){
      //         let stat = {
      //          timestamp: doc.metadata.timestamp,
      //          value: doc.data
      //         }
      //         stats.push(stat)
      //       }
      //     })
      //
      //     //////////console.log('stats/get 2', stats)
      //     this.__set_stat_data(stats)
      //
      //   }
      //
      //   if(range.length > 0 && range[0] && range[1]){
      //     this.$options.__range_init = false
      //
      //     this.$store.commit('dashboard/events/add', {
      //       id: this.id,
      //       type: 'onRange',
      //       'opts': {
      //         range: range,
      //         // tabular: (this.$options.type === 'tabular') ? true : false
      //       }
      //     })
      //   }
      // })

      /**
      * @test - no local data
      **/
      let docs = []
      let new_docs_range = this.__get_new_range(docs, JSON.parse(JSON.stringify(this.stat.range)))
      docs = new_docs_range.docs
      let range = new_docs_range.range

      if (docs.length > 0) {
        // ////console.log('stats/get', docs, range)

        let stats = []
        Array.each(docs, function (doc) {
          if (doc && doc.data) {
            let stat = {
              timestamp: doc.metadata.timestamp,
              value: doc.data
            }
            stats.push(stat)
          }
        })

        /// ///////console.log('stats/get 2', stats)
        this.__set_stat_data(stats)
      }

      if (range.length > 0 && range[0] && range[1]) {
        this.__change_range(range)
      }

      /**
      * @test - no local data
      **/
    }

    if (this.stat.merged === true) {
      // this.$options.deque = new Deque(this.stat.data.length * 1)
      //
      // //////////console.log('stat.vue id', this.id, this.$options.type, this.stat.range, this.$options.deque, this.$options.deque.length, QUEUE_SIZE)
      // if(this.stat.data && this.stat.data[0]){
      this.$options.__stat_unwatcher = this.$watch('stat.data', this.update_stat_merged_data.bind(this), { deep: true })
      // }
    } else {
      this.$options.__stat_unwatcher = this.$watch('stat.data', this.update_stat_data.bind(this), { deep: true })
    }
  },
  beforeDestroy () {
    /**
    * @test - no local data
    **/
    // this.$store.dispatch(this.$options.type+'/'+this.id+'/flush')
  },
  destroyed () {
    this.$off()
  },
  methods: {
    update_stat_merged_data: function (stats, old) {
      const DATA_LENGTH = stats.length

      /**
        * if you don't clone it , you may be manipulating other stats using this sames stats
        **/
      stats = Array.clone(stats)// now we are safe to modify
      let val = (stats) ? stats[0] : undefined
      /// ///////console.log('stat.data.0', val)

      if (val && val.length > 0) {
        if (!Array.isArray(val[0])) { // array of array, range data
          val = [val]
        }

        let columns = []
        for (let i = 1; i < DATA_LENGTH; i++) { // ommit timestamp
          columns.push(stats[i])
        }

        // //console.log('MERGED COLUMNS', columns)

        if (columns.length > 0) {
          let matched_columns = false
          Array.each(val, function (row, index) {
            Array.each(columns, function (column, col_index) {
              // //console.log('COLUMN',column)
              if (column) {
                if (Array.isArray(column[0])) { // array of array, range data
                  val[index] = this._merge_tabular_data(val[index], column[index])// match columns/rows
                } else {
                  val[index] = this._merge_tabular_data(val[index], column)// fill always with same val
                }
                matched_columns = true
              }
            }.bind(this))
          }.bind(this))

          /// ///////console.log('__stat_unwatcher merged ', val)

          if (matched_columns === true) {
            if (stats.length === 1) {
              this.__add_stats(val[val.length - 1])
            } else {
              this.__add_stats(val)
            }
          }
        }
      }
    },
    update_stat_data: function (val, old) {
      debug('update_stat_data %s', this.id, val)

      // console.log('__stat_unwatcher', this.id, val, this.stat.length)
      val = JSON.parse(JSON.stringify(val))

      /**
      * when use "stat.sources" as data, is always an array, even if it's not merged data
      * so we need to pick the only element (if there are more, is an error)
      */

      if (Array.isArray(val)) { val = val[0] }

      // this.__stat_data_watcher(val)
      if (val && val.length > 0) {
        let __cloned = Array.clone(val)
        if (val.length === 1) {
          this.__add_stats(__cloned[__cloned.length - 1])
        } else {
          this.__add_stats(__cloned)
        }
      }
    },
    /**
    * based on docs (obtained from local DB) and range, defined if we can update stat with this
    * plus a shorter remote range, or we need to clear and obtain all new data from remote
    */
    __change_range (range) {
      this.$options.__range_init = false

      debug('adding event', 'dashboard_' + this.dashboard + '/events/add', this.id)

      this.$store.commit('dashboard_' + this.dashboard + '/events/add', {
        id: this.id,
        type: 'onRange',
        'opts': {
          range: range
          // tabular: (this.$options.type === 'tabular') ? true : false
        }
      })
    },
    __get_new_range: function (docs, range) {
      // //////console.log('__get_new_range', docs, Array.clone(range))

      if (
        docs.length > 0 &&
        docs[docs.length - 1] &&
        docs[docs.length - 1].metadata &&
        docs[0].metadata.timestamp > range[0] - 10000 &&
        docs[0].metadata.timestamp < range[0] + 10000
      ) {
        /// ///console.log('__get_new_range', docs, Array.clone(range))

        let prev
        let missing = false

        docs.sort(function (a, b) { return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0) })

        Array.each(docs, function (doc) {
          if (prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp) {
            missing = true
          }
          prev = doc
        })

        if (missing === false) {
          range[0] = docs[docs.length - 1].metadata.timestamp
        } else {
          docs = []
        }
      } else {
        docs = []
      }

      return { docs: docs, range: range }
    },
    // __stat_data_watcher: function(val){
    //   if(val && val.length > 0 && !this.$store.state[this.$options.type][this.id]){
    //     //////////console.log('registerModule stat', this.$options.type, this.id)
    //     this.$store.registerModule([this.$options.type, this.id], Object.clone(statStore))
    //     this.$store.commit(this.$options.type+'/'+this.id+'/set_id', this.id)
    //     this.$store.commit(this.$options.type+'/'+this.id+'/set_type', this.$options.type)
    //   }
    //   else if(val && val.length > 0){
    //     this.__add_stats(val)
    //   }
    // },
    _merge_tabular_data: function (a, b) {
      let merged = Array.clone(a)
      if (!b) {
        merged.push(undefined)
      } else {
        for (let i = 1; i < b.length; i++) { // ommit timestamp
          merged.push(b[i])
        }
      }
      return merged
    },
    __add_stats: function (stat) {
      // console.log('stat.vue __add_stats', this.id, stat)

      let data = {}
      if (this.$options.type === 'tabular') {
        if (Array.isArray(stat[0])) { // array of array, range data
          let result = []
          Array.each(stat, function (value) {
            result.push({
              timestamp: value[0],
              value: value
            })
          })

          // result.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

          /// /////////////////console.log('process_os_tabular', path, key, result)
          data = {
            tabular: true,
            root: this.$options.root,
            path: this.$options.path,
            key: this.$options.key,
            data: result
          }
        } else {
          data = {
            tabular: true,
            root: this.$options.root,
            path: this.$options.path,
            key: this.$options.key,
            data: {
              timestamp: stat[0],
              value: stat
            }
          }
        }
      } else {
        data = {
          tabular: false,
          root: this.$options.root,
          path: this.$options.path,
          key: this.$options.key,
          data: stat
        }
      }

      // Object.each(paths, function(keys, path){
      /// ///////////console.log('__add_os_doc_stats PATH', path)

      // Object.each(keys, function(data, key){
      /// ///////////console.log('__add_os_doc_stats KEY', key, data)

      /**
      * @test - no local data
      */
      // this.$store.dispatch(this.$options.type+'/'+this.id+'/add', data)

      this.__set_stat_data(data.data)
      // this.$options.stat_data.push( data.data )
      // this.stat_lastupdate = Date.now()
      //
      // let splice = this.stat.length * 1
      //
      // let length = this.$options.stat_data.length
      //
      // // splice = (splice === 1) ? 2 : splice
      //
      // // if(splice === 0){
      // //   this.$set(this.stats[name], 'data', [])
      // // }
      // // else{
      //   this.$options.stat_data.splice(
      //     (splice * -1) -1,
      //     length - splice
      //   )
      // // }
      //
      //
      // // //////////console.log('stat.vue __add_stats', this.id, data.data, this.$options.stat_data.length, splice, length)
      //

      //   }.bind(this))
      //
      // }.bind(this))
    },
    __set_stat_data: function (data) {
      debug('__set_stat_data %s %o', this.id, data)
      // console.log('stat.vue __set_stat_data', this.id, data)
      /**
      * @config: this should be config options
      * this.$options.focus
      * this.$options.visible
      */
      // if(this.$options.focus === true && this.$options.visible === true && data){
      //   //////console.log('__set_stat_data visibility', this.id, this.$options.focus, this.$options.visible)

      // docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )
      // let __stat_data = Array.clone(this.$options.stat_data)
      //
      // if(!Array.isArray(data) && this.$options.__range_init === true){
      //   __stat_data.push(Object.clone(data))
      // }
      // else{
      //   __stat_data = __stat_data.append(Array.clone(data))
      //   this.$options.__range_init = true
      // }
      //
      // __stat_data.sort(function(a,b) {
      //   return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);
      // })
      // let splice = this.stat.length
      // let length = __stat_data.length
      //
      // __stat_data.splice(
      //   (splice * -1) -1,
      //   length - splice
      // )
      //
      // this.$set(this, 'stat_data', __stat_data)

      if (this.no_buffer === false) {
        if (this.$options.__range_init === false) {
          // this.$options.__buffer_data.push(JSON.parse(JSON.stringify(data)))
          this.$options.__buffer_data = this.$options.__buffer_data.append(JSON.parse(JSON.stringify(data)))

          if (this.$options.__buffer_data.length > 10) { this.$options.__range_init = true }
        } else {
          // this.$options.__buffer_data.push(JSON.parse(JSON.stringify(data)))
          this.$options.__buffer_data = this.$options.__buffer_data.append(JSON.parse(JSON.stringify(data)))

          Array.each(Array.clone(this.$options.__buffer_data), function (val) {
            let found = false
            Array.each(this.$options.stat_data, function (stat) {
              if (stat.timestamp === val.timestamp) { found = true }
            })

            if (found === false) { this.$options.stat_data.push(val) }
          }.bind(this))

          this.$options.__buffer_data = []
        }
      } else { // no_buffer
        this.$options.stat_data = data
        this.$options.__range_init = true
      }

      // if (Array.isArray(data) && this.$options.__range_init === false) {
      //   // this.$set(this, 'stat_data', this.$options.stat_data.append(data))
      //   Array.each(Array.clone(data), function (val) {
      //     let found = false
      //     Array.each(this.$options.stat_data, function (stat) {
      //       if (stat.timestamp === val.timestamp) { found = true }
      //     })
      //
      //     if (found === false) { this.$options.stat_data.push(val) }
      //   }.bind(this))
      //
      //   /**
      //   * avoid putting data on graph until range data arrives
      //   **/
      //   if (data.length > 1) { this.$options.__range_init = true }
      //
      //   // this.$store.commit('dashboard/events/remove', {
      //   //   id: this.id,
      //   //   type: 'onRange'
      //   // })
      // }

      // if (this.$options.__buffer_data.length > 10) { this.$options.__range_init = true }
      // debug('__set_stat_data', this.id, data, this.$options.stat_data, this.$options.__buffer_data.length, this.$options.__range_init)

      if (this.$options.__range_init === true) {
        // if you are not using buffer, you are managing your data, you are in charge of sorting
        if (this.no_buffer === false) {
          this.$options.stat_data.sort(function (a, b) {
            return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)
          })

          let length = this.$options.stat_data.length
          let splice = this.stat.length * this.chart.interval
          // || this.$options.stat_data.length
          // this.$options.tabular.data = data

          this.$options.stat_data.splice(
            (splice * -1) + 1,
            length - splice
          )

          debug('__set_stat_data', this.id, this.$options.stat_data.length, splice, length)
        }

        this.stat_lastupdate = Date.now()

        // let splice = this.stat.length
        // let length = this.$options.stat_data.length
        //
        // debug('__set_stat_data splice %o %o %o', splice, length, this.$options.stat_data)
        // this.$options.stat_data.splice(
        //   // (splice * -1) - 1,
        //   (splice * -1) + 1,
        //   length - splice
        // )
        //
        // // this.$emit('stat_data', this.$options.stat_data)
        // debug('__update_data', this.$options.stat_data.length)

        this.__update_data(this.$options.stat_data)
      }
      // ////console.log('stat.vue/splice', splice, length, this.$options.stat_data)

      // }
      // //console.log('__set_stat_data', data, this.$options.__range_init)
    }
    // get: function(payload, cb){
    //   //////////////console.log('__get_stat', payload)
    //   if(payload.tabular === true){
    //     this.$store.dispatch('stats_tabular/get', payload).then((docs) => cb(docs))
    //   }
    //   else{
    //     this.$store.dispatch('stats/get', payload).then((docs) => cb(docs))
    //   }
    // },
  }
}
</script>
