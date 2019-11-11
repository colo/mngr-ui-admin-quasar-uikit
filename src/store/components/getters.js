/*
export function someGetter (state) {
}
*/

export default {
  // getLayout: (state) => (id) => {
  //   console.log('getters getLayout', id)
  //   // console.log(state.ns)
  //   // const ns = (!state.ns) ? getModuleNamespace(this, state) : state.ns
  //   //
  //   return state[id].layout
  // },
  getComponents: (state) => (id) => {
    // console.log('getters getComponents', id, state[id])
    // console.log(state.ns)
    // const ns = (!state.ns) ? getModuleNamespace(this, state) : state.ns
    //
    return state[id]
  }
}
