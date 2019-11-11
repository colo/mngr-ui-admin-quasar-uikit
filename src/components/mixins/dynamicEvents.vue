<script>
import VueQuery from 'vuequery'

import * as Debug from 'debug'
const debug = Debug('components:mixins:dynamicEvents')

export default {
  // https://forum.vuejs.org/t/dynamic-props-and-custom-event-emit-in-dynamic-component/10932
  directives: {
    DynamicEvents: {
      bind: (el, binding, vnode) => {
        // debug('DynamicEvents.bind', el, binding, vnode)
        const allEvents = binding.value
        Object.keys(allEvents).forEach((event) => {
          // register handler in the dynamic component
          vnode.componentInstance.$on(event, (eventData) => {
            const targetEvent = allEvents[event]
            // if(Array.isArray(eventData))
            debug('DynamicEvents', vnode.context)
            if (vnode.context[targetEvent]) {
              vnode.context[targetEvent](eventData, event, vnode.componentInstance)
            } else {
              const parents = VueQuery(vnode.context).parents()
              for (let i = 0; i < parents.length; i++) {
                if (parents[i].vm[targetEvent]) {
                  debug('DynamicEvents found', parents[i])
                  parents[i].vm.$vnode.componentInstance[targetEvent](eventData, event, vnode.componentInstance)
                  i = parents.length// to exit loop
                }
              }

              // vnode.context.$parent[targetEvent](eventData, event, vnode.componentInstance)
            }
          })
        })
      },
      unbind: function (el, binding, vnode) {
        vnode.componentInstance.$off()
      }
    }

  }
}
</script>
