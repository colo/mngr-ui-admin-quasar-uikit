/*
export function someMutation (state) {
}
*/

import Vue from 'vue'
import { extend } from 'quasar'

export function setComponents (state, grid) {
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

export function addComponents (state, grid) {
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
