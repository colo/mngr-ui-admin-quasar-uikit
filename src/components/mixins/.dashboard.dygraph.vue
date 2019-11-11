
<script>
// import the module here instead of in `src/store/index.js`

import * as Debug from 'debug'
const debug = Debug('components:mixins:dashboard.dygraph')
// const debug_internals = Debug('components:mixins:dashboard.dygraph:Internals')
// const debug_events = Debug('components:mixins:dashboard.dygraph:Events')

import dashboardMixin from '@mixins/dashboard'

import { EventBus } from 'boot/eventbus'

/* global synchronize */
/* eslint no-undef: "error" */
import '@libs/synchronizer' // modified version
import Dygraph from 'dygraphs'

import { mapState } from 'vuex'

export default {
  mixins: [dashboardMixin],

  __sync: undefined,
  highlighted: false,

  computed: Object.merge(
    mapState({
      dygraph_smoothness: function (state) {
        if (this.id && state['dashboard_' + this.id] && state['dashboard_' + this.id].options.dygraph.smoothness !== undefined) {
          debug('dygraph_smoothness', state['dashboard_' + this.id].options.dygraph.smoothness)
          return state['dashboard_' + this.id].options.dygraph.smoothness
        } else {
          return false
        }
      }
    })

  ),

  methods: {

    sync_charts: function () {
      debug('sync_charts', this.$refs)
      if (!this.$options.__sync) {
        let gs = []
        // let sync = []
        /// ///////////////////////////////console.log(this.$refs, this.host)
        Object.each(this.$refs, function (ref, name) {
          debug('$ref name', name)

          if (this.visibility[name] === true) {
            Array.each(ref, function (_ref) {
              if (_ref.$children && _ref.$options.visible === true) {
                Array.each(_ref.$children, function (child) {
                  if (child.$options.graph instanceof Dygraph) {
                  // console.log('sync charts', name, ref)
                    gs.push(child.$options.graph)
                  }
                })
              }
            })
          }
        }.bind(this))

        this.unsync_charts()

        // console.log('GS', gs)

        if (gs.length > 1) {
          this.$options.__sync = synchronize(gs, {
            zoom: true,
            // selection: true,
            range: false
          })
        }
      }
    },
    unsync_charts: function () {
      if (this.$options.__sync) {
        // ////////console.log('detaching', this.$options.sync)
        this.$options.__sync.detach()
        this.$options.__sync = undefined
      }
    }

  },

  created: function () {
    let self = this
    this.$eventbus.$on('highlightCallback', function (params) {
      debug('highlightCallback')
      self.$options.highlighted = true
      self.sync_charts()
    })

    this.$eventbus.$on('unhighlightCallback', event => {
      self.$options.highlighted = false
      self.unsync_charts()
    })
  },
  beforeDestroy: function () {
    this.$eventbus.$off('highlightCallback')
    this.$eventbus.$off('unhighlightCallback')
  }

}
</script>

<style>
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
