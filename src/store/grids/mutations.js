/*
export function someMutation (state) {
}
*/

import Vue from 'vue'
import { extend } from 'quasar'

export function setGrid (state, grid) {
  // let newGrid = extend(true, state._default, grid)
  // if (!grid.layout) { grid.layout = [] }
  const id = grid.id
  delete grid.id
  // if (state[id]) {
  //   let newGrid = extend(true, state[id], grid)
  //   state[id] = newGrid
  // }
  // state[id] = grid
  Vue.set(state, id, grid)
}

export function addGrid (state, grid) {
  const id = grid.id
  delete grid.id
  if (!state[id]) {
    let newGrid = extend(true, state._default, grid)
    // if (!grid.layout) { grid.layout = [] }
    // state[id] = newGrid
    Vue.set(state, id, newGrid)
  }
  // else {
  //   state[id] = grid
  // }
}

// export function setComponents (state, components) {
//   // let newGrid = extend(true, state._default, grid)
//   // if (!grid.layout) { grid.layout = [] }
//   const id = components.id
//   delete components.id
//   // if (state[id]) {
//   //   let newGrid = extend(true, state[id], grid)
//   //   state[id] = newGrid
//   // }
//   state.components[id] = components
// }
//
// export function addComponents (state, components) {
//   const id = components.id
//   delete components.id
//   if (!state.components[id]) {
//     let newComponents = extend(true, state._components, components)
//     // if (!grid.layout) { grid.layout = [] }
//     state.components[id] = newComponents
//   }
//   // else {
//   //   state[id] = grid
//   // }
// }
