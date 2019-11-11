import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

import source from '../source'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    data: source,
    stat: source,
    tabular: source
  }
}
