<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <!-- <q-page :style="{height: height}"> -->

    <VueResponsiveGridLayout
        @layout-update="onLayoutUpdate"
        @layout-change="onLayoutChange"
        @layout-init="onLayoutInit"
        @width-change="onWidthChange"
        @breakpoint-change="onBreakpointChange"
        :layouts="viewGrid.layouts"
        :compactType="'vertical'"
        :breakpoint="viewGrid.breakpoint"
        :cols="viewGrid.cols"
        :ref="id"
        :id="id"
        :key="id"
        :useCSSTransforms="true"
        :breakpoints="viewGrid.breakpoints"
        :colsAll="viewGrid.colsAll"
        :class="className"
    >
    <!-- class="absolute-full" -->
      <template slot-scope="props">

        <VueGridItem :key="index" v-for="(item, index) in props.layout"
          :i="item.i"
          :w.sync="item.w"
          :h.sync="item.h"
          :x="item.x"
          :y="item.y"
          :immobile.sync="item.immobile"
          :containerWidth="props.containerWidth"
          :rowHeight="props.rowHeight"
          :isDraggable="viewGrid.isDraggable"
          :isResizable="viewGrid.isResizable"
          :className="(viewGrid.preview !== true) ? 'grid-item' : '' "
          :cols="props.cols"
          :heightFromChildren="false"
          :maxRows="props.maxRows"
          :class="'bg-secondary col-'+viewGrid.breakpoint+'-'+viewGrid.colsAll[viewGrid.breakpoint]"
        >
        <!-- :heightFromChildren="false" -->

           <draggable
            v-if="!item.immobile"
            class="list-group"
            :id="item.i"
            :key="item.i"
            :list="viewComponents[item.i]"
            group="components"
            @add="addComponent"
            @remove="removeComponent"
            @change="log"
            >
              <!-- class="list-group-item" -->
             <div
              v-for="(widget, wIndex) in viewComponents[item.i]"
              :key="item.i+'.'+wIndex"
              :id="item.i+'.'+wIndex"
            >
              <!-- {{widget.component}} -->
              <component
                v-if="widget.component"
                :is="resolveComponent(widget.component)"
                v-bind="widget.props"
                :key="(widget.id) ? widget.id : item.i+'.'+wIndex+'.component'"
                v-dynamic-events="(widget.events) ? widget.events : {}"
              />
              <!-- v-dynamic-options="(widget.options) ? widget.options : {}" -->

              <template v-else-if="widget.slot">
                {{widget.slot}}
              </template>
            </div>
          </draggable>
          <!--  not draggables (immobile)-->
          <div
           v-else
           v-for="(widget, wIndex) in viewComponents[item.i]"
           :key="item.i+'.'+wIndex"
           :id="item.i+'.'+wIndex"
         >
           <component
             v-if="widget.component"
             :is="resolveComponent(widget.component)"
             v-bind="widget.props"
             :key="(widget.id) ? widget.id : item.i+'.'+wIndex+'.component'"
             v-dynamic-events="(widget.events) ? widget.events : {}"
           />
           <template v-else-if="widget.slot">
             {{widget.slot}}
           </template>
         </div>

          <!-- </section> -->
          <!-- </div> -->

        <!-- :className="'grid-item'" -->
          <!-- Test {{item.i}}
          <component :is="item.component"></component> -->
          <!-- <div :key="index+'.'+elIndex" v-for="(element, elIndex) in item.elements" class="connectedSortable">
            <component
            :is="element.type"
            v-bind="element.options"
            v-on="element.events"
            style="position: relative"
          />

          </div> -->

          <q-icon
            name="fa fa-trash-alt"
            v-if="viewGrid.preview !== true && !item.immobile"
            @click="removeItem(index)"
            style="position: absolute; bottom: 0px; left: 4px;"
          />
        </VueGridItem>

      </template>

    </VueResponsiveGridLayout>

  <!-- </section> -->
<!-- </div> -->
  <!-- </q-page> -->
</template>
<script>
// import { mapGetters, mapActions } from 'vuex'
// import TextWidget from './TextWidget'
// import TextAreaWidget from './TextAreaWidget'
// import ImageWidget from './ImageWidget'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('components:mixins:gridView')

import draggable from 'vuedraggable'
import { VueResponsiveGridLayout, VueGridItem } from 'vue-responsive-grid-layout'
import { mapState, mapGetters } from 'vuex'

import { dom } from 'quasar'
const { height, width } = dom

import DynamicEvents from '@components/mixins/dynamicEvents'

export default {
  name: 'GridView',
  mixins: [DynamicEvents],
  // components: { GridLayout, GridItem, TextWidget, TextAreaWidget, ImageWidget },
  components: { VueResponsiveGridLayout, VueGridItem, draggable },

  props: {
    swap_components: {
      type: [Boolean],
      default: false
    },
    className: {
      type: [String],
      default: 'absolute-full'
    },
    id: {
      type: [String],
      default: undefined
    },
    // componentsDir: {
    //   type: [String, Array],
    //   default: ''
    // },
    components: {
      type: [Object],
      default: function () {
        return {}
      }
    },
    grid: {
      type: [Object],
      default: function () {
        return {}
      }
    }
    // EventBus: undefined
  },

  data: function () {
    return {
      height: '0px'
    }
  },
  // updated: function () {
  //   // // console.log('height:', height(document.getElementById('logs')))
  //   // debug('updated', height(this.$refs[this.id].$el))
  //   let height = this.getGridHeight()
  //   debug('updated %d', height)
  //   this.height = height + 'px'
  //   this.$emit('height', height)
  // },
  updated: function () {
    // // console.log('height:', height(document.getElementById('logs')))
    // debug('updated', height(this.$refs[this.id].$el))
    let height = this.getGridHeight()
    debug('updated height %d', height)
    this.height = height + 'px'
    this.$emit('height', height)
  },
  // mounted: function () {
  // //   debug('mounted', this.getGridHeight())
  // //   // // console.log('height:', height(document.getElementById('logs')))
  // //   this.height = this.getGridHeight() + 700 + 'px'
  //   this.$forceUpdate()
  // },
  created: function () {
    debug('created', this.id)
    let id = this.id
    // if (id && !this.$store.state['grid_' + id]) { this.$store.registerModule('grid_' + id, GridStore) }

    let grid = {}
    if (this.grid) {
      grid = Object.clone(this.grid)
      grid.id = this.id
      this.viewGrid = grid
    } else {
      grid.id = this.id
      this.$store.commit('grids/addGrid', grid)
    }

    let components = {}
    if (this.components) {
      components = Object.clone(this.components)
      components.id = this.id
      this.viewComponents = components
    } else {
      components.id = this.id
      this.$store.commit('components/addComponents', components)
    }

    // for (const index in this.viewComponents) {
    //   for (const i in this.viewComponents[index]) {
    //     this.resolveComponent(this.viewComponents[index][i])
    //   }
    // }

    // for (const id in this.viewComponents) {
    //   for (const i in this.viewComponents[id]) {
    //     if (this.viewComponents[id][i].component) { this.resolveComponent(this.viewComponents[id][i].component) }
    //   }
    // }

    // this.viewComponents = JSON.parse(JSON.stringify(this.$store.getters['components/getComponents'](this.id)))
    //
    // this.$watch('this.viewComponents', function (val, oldVal) {
    //   debug('watch components', this.id, val)
    //   val.id = this.id
    //   this.$store.commit('components/setComponents', JSON.parse(JSON.stringify(val)))
    // })

    // this.EventBus.$on('sortable', function (e, ui) {
    //   debug('$on sortable', e, ui)
    // })

    // this.$forceUpdate()
  },
  // watch: {
  //   components: function (val, oldVal) {
  //     debug('watch components', this.id, val)
  //     val.id = this.id
  //     this.$store.commit('components/setComponents', JSON.parse(JSON.stringify(val)))
  //   }
  //
  // },

  computed: {
    viewGrid: {
      get () {
        debug('get viewGrid', this.$store.getters['grids/getGrid'](this.id))
        // return JSON.parse(JSON.stringify(this.$store.state['grid_' + this.id].layout))
        // return JSON.parse(JSON.stringify(this.$store.getters['grids/getLayout'](this.id)))
        // return this.$store.state.grids[this.id]
        return Object.clone(this.$store.getters['grids/getGrid'](this.id))
      },
      set (grid) {
        debug('set viewGrid', this.id, grid)
        grid.id = this.id
        this.$store.commit('grids/setGrid', grid)
        // this.$forceUpdate()
        // this.$store.state.grids[this.id].layout = JSON.parse(JSON.stringify(layout))
      }
    },
    viewComponents: {
      get () {
        debug('get viewComponents', this.id, Object.clone(this.$store.getters['components/getComponents'](this.id)))
        // let grid = JSON.parse(JSON.stringify(this.$store.getters['grids/getGrid'](this.id)))
        // let components = this.$store.state.grids.components
        // return components[this.id]
        return Object.clone(this.$store.getters['components/getComponents'](this.id))
      },
      set (components) {
        debug('set viewComponents', this.id, components)
        components.id = this.id
        // components = JSON.parse(JSON.stringify(components))
        // // grid.components = components
        this.$store.commit('components/setComponents', components)
        // this.$forceUpdate()
      }
    }
  },
  watch: {
    components: {
      // immediate: true,
      deep: true,
      handler: function (components) {
        debug('watch components', components)
        // components = JSON.parse(JSON.stringify(components))
        components = Object.clone(components)
        // for (const index in components) {
        //   for (const i in components[index]) {
        //     this.resolveComponent(components[index][i])
        //   }
        // }
        // components.id = this.id
        this.viewComponents = components
      }
    },
    grid: {
      // immediate: true,
      deep: true,
      handler: function (grid) {
        debug('watch grid', grid)
        // grid = JSON.parse(JSON.stringify(grid))
        grid = Object.clone(grid)
        // grid.id = this.id
        this.viewGrid = grid
      }
    }
  },
  methods: {
    proxyEvent: function (data, event, vnode) {
      debug('proxyEvent %o ', arguments)
      this.$emit(vnode.id + ':' + event, data)
    },
    getGridHeight: function () {
      debug('getGridHeight', height(document.getElementById(this.id)))
      // return height(document.getElementById(this.id)) + 700
      return height(document.getElementById(this.id))
    },

    resolveComponent: function (component) {
      debug('resolveComponent', component)
      //
      // debug('resolveComponent locals', this.$options.components)
      // debug('resolveComponent globals', Vue.options.components)
      let exists = false
      // locals
      if (this.$options.components[component]) {
        exists = true
      } else {
        for (const name in this.$options.components) {
          let _component = this.$options.components[name]
          // debug('resolveComponent _component local', _component)
          if (_component.name && _component.name === component) { exists = true }
          if (_component.extendOptions && _component.extendOptions.name === component) { exists = true }
        }

        if (exists === false) {
          if (Vue.options.components[component]) {
            exists = true
          } else {
            for (const name in Vue.options.components) {
              let _component = Vue.options.components[name]
              // debug('resolveComponent _component global', _component)
              if (_component.name && _component.name === component) { exists = true }
              if (_component.extendOptions && _component.extendOptions.name === component) { exists = true }
            }
          }
        }
      }
      // debug('resolveComponent globals', Vue.$options.components)
      if (exists === false) {
        // return () => import('@components/test/' + component)
        // Vue.component(
        //   component,
        //   // The `import` function returns a Promise.
        //   () => import('@components/' + this.componentsDir + '/' + component + '.vue')
        // )

        // https://vuejs.org/v2/guide/components-dynamic-async.html

        // https://webpack.js.org/guides/dependency-management/#require-context
        const requireComponent = require.context(
          // Look for files in the current directory
          '@components/',
          // Do not look in subdirectories
          true,
          // Only include "_base-" prefixed .vue files
          /[\w-]+\.vue$/
        )

        let resolver = function (component) {
          debug('resolver', component)
          // For each matching file name...
          requireComponent.keys().forEach((fileName) => {
            // Get the component config
            // debug('resolver', component, dir, fileName)
            const componentConfig = requireComponent(fileName)
            // Get the PascalCase version of the component name
            const componentName = upperFirst(
              camelCase(
                fileName
                  // Remove the "./_" from the beginning
                  // .replace(/^\.\/_/, '')
                  // Remove the file extension from the end
                  .replace(/\.\w+$/, '')
              )
            )
            // Globally register the component
            // // console.log('componentName')

            if (componentName === component) {
              debug('resolver add', component, fileName, componentName)
              Vue.component(componentName, componentConfig.default || componentConfig)
              return component
            }
          // Vue.component(component, function (resolve) {
          //   // This special require syntax will instruct Webpack to
          //   // automatically split your built code into bundles which
          //   // are loaded over Ajax requests.
          //   require(['@components/' + dir + '/' + component + '.vue'], resolve)
          // })
          })
          // Vue.component(component, '@components/' + dir + '/' + component + '.vue')
        }

        // if (Array.isArray(this.componentsDir)) {
        //   for (let i in this.componentsDir) {
        //     resolver(component, this.componentsDir[i])
        //   }
        // } else {
        return resolver(component)
        // }

        // return require('@components/' + this.componentsDir + '/' + component + '.vue')
      } else {
        debug('resolve exist', component)
        return component
      }
    },
    addComponent: function (evt) {
      // let grid_id = evt.to.substring(evt.to.indexOf('.'))
      let from = evt.item.id.split('.')[0]
      let old_index = evt.item.id.split('.')[1]
      let new_index = evt.newIndex
      debug('addComponent', evt, evt.to.id, evt.item.id, from, old_index, new_index)
      let components = Object.clone(this.$store.getters['components/getComponents'](this.id))

      debug('addComponent components', this.id, components, evt.to.id, evt.from.id, Object.clone(this.$store.getters['grids/getGrid'](this.id)))
      components[evt.to.id] = (components[evt.to.id]) ? components[evt.to.id] : []
      // let swap_components = true
      if (this.swap_components) {
        let grid = Object.clone(this.$store.getters['grids/getGrid'](this.id))
        Object.each(grid.layouts, function (layout) {
          let from, to
          Array.each(layout, function (component, index) {
            if (component.i === evt.to.id) { to = index }

            if (component.i === evt.from.id) { from = index }
          })
          let tmp_to = Object.clone(layout[to])
          layout[to] = layout[from]
          layout[from] = tmp_to
        })

        this.viewGrid = grid

        let _swap_component = Object.clone(components[evt.to.id][new_index])
        components[evt.to.id][new_index] = components[from][old_index]
        components[evt.from.id][new_index] = _swap_component
        // components[evt.to.id].splice(new_index, 0, components[from][old_index])
      } else {
        components[evt.to.id].splice(new_index, 0, components[from][old_index])
      }
      // this.viewComponents = components
      debug('addComponent components', this.id, components, evt.to.id, evt.from.id)

      components.id = this.id
      // this.$store.commit('components/setComponents', components)
      this.viewComponents = components
    },
    removeComponent: function (evt) {
      // let swap_components = true
      if (this.swap_components === false) {
        let from = evt.item.id.split('.')[0]
        let old_index = evt.item.id.split('.')[1]
        let new_index = evt.newIndex
        debug('removeComponent', evt, evt.to.id, evt.item.id, from, old_index, new_index)
        let components = Object.clone(this.$store.getters['components/getComponents'](this.id))

        debug('removeComponent components', components)
        components[evt.from.id].splice(old_index, 1)
        // this.viewComponents = components
        components.id = this.id
        // this.$store.commit('components/setComponents', components)
        this.viewComponents = components
      }
    },
    disableGrid: function () {
      debug('disableGrid')

      let grid = this.viewGrid
      grid.preview = !grid.preview
      grid.isDraggable = grid.isResizable = !(grid.preview)
      // grid.isDraggable = !grid.isDraggable
      // grid.isResizable = !grid.isResizable
      // grid.contenteditable = !grid.contenteditable
      this.viewGrid = grid
    },
    disableEdit: function () {
      debug('disableEdit')

      let grid = this.viewGrid
      // grid.preview = !grid.preview
      grid.isDraggable = !grid.isDraggable
      grid.isResizable = !grid.isResizable
      // grid.contenteditable = !grid.contenteditable
      this.viewGrid = grid
    },
    removeItem: function (key) {
      debug('removeItem', key)
      // if (key > -1) {
      if (key > -1) {
        for (const breakpoint in this.viewGrid.layouts) {
          let layout = this.viewGrid.layouts[breakpoint]
          layout.splice(key, 1)
          let grid = this.viewGrid
          grid.layouts[breakpoint] = layout
          this.viewGrid = grid
          // this.$set('grid', grid)
          // this.$set(this.layouts, breakpoint, layout)
        }
      }
    },
    onLayoutUpdate (layout, layouts, last) {
      debug('grid event onLayoutUpdate', this.id, layout, layouts, last)
      // this.$set(this.layouts, this.breakpoint, layout)
      let grid = this.viewGrid
      grid.layouts[grid.breakpoint] = layout
      this.viewGrid = grid
    },

    onLayoutChange (layout, layouts, breakpoint) {
      debug('grid event onLayoutChange', this.id, layout, layouts, breakpoint)
      // this.$set(this.layouts, breakpoint, layout)
      let grid = this.viewGrid
      grid.layouts[breakpoint] = layout
      this.viewGrid = grid
    },

    onLayoutInit (layout, layouts, cols, breakpoint) {
      debug('grid event onLayoutInit', this.id, layout, layouts, cols, breakpoint, JSON.parse(JSON.stringify(this.viewComponents)))
      // this.cols = cols
      // this.breakpoint = breakpoint
      // this.$set(this.layouts, breakpoint, layout)
      let grid = this.viewGrid
      grid.cols = cols
      grid.breakpoint = breakpoint
      grid.layouts[grid.breakpoint] = layout
      this.viewGrid = grid
      this.$forceUpdate()
    },

    onBreakpointChange (breakpoint) {
      debug('grid event onBreakpointChange', this.id, breakpoint)
      // this.breakpoint = breakpoint
      let grid = this.viewGrid
      grid.breakpoint = breakpoint
      this.viewGrid = grid
    },

    onWidthChange (width, cols) {
      debug('grid event onWidthChange', this.id, width, cols)
      // this.cols = cols
      let grid = this.viewGrid
      grid.cols = cols
      this.viewGrid = grid
    },
    log: function (evt) {
      // window.console.log(evt)
      debug('log %o', evt)
    }
    // gridMode () {
    //   debug('gridMode')
    //   this.$refs.layout.resizeAllItems(2, 'vertical')
    // },
    // listMode () {
    //   debug('listMode')
    //   this.$refs.layout.resizeAllItems(this.cols, 'horizontal')
    // }
  }

}
</script>

<style>
/* #app {
  background: #fff;
  border-radius: 4px;
  transition: all 0.2s;
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#content {
  padding: 0px 20px;
  min-height: 100vh;
  transition: all 0.3s;
  width: 100%;
} */

/* #content {
  padding: 0px 20px;
  min-height: 100vh;
  transition: all 0.3s;
  width: 100%;
} */

.resizable-handle {
  position:absolute;
  width:20px;
  height:20px;
  bottom:0;
  right:0px;
  text-align:right;
}
.resizable-handle::after {
  content: "";
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 5px;
  height: 5px;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
}
.vue-grid-draggable-container {
  width: 100%;
  height: 100%;
}
.grid-item {
  border: 1px dotted #000;
}
/* .vue-grid-placeholder {
  background: #ddd; border: 2px dashed #aaa;
} */

/* .vue-responsive-grid-layout */
.vue-grid-layout {
  width: 100%;
  display:block;
  position:relative;
  height: 100%;
}

</style>
