/* eslint no-undef: "error" */
/* eslint-env node */

/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
import Vue from 'vue'
const EventBus = new Vue()

/**
* needed for pipelines and libs (dygraph) as a way to comunicate with Vue (emit events)
**/
if (!window['EventBus']) { window['EventBus'] = EventBus }

// export default ({ Vue }) => {
//   // for use inside Vue files through this.$axios
//   Vue.prototype.$eventbus = EventBus
// }

export { EventBus }
