import Vue from 'vue'

export const add = (state, payload) => {
  // if(payload.id.indexOf('.')> -1)
  // payload.id = payload.id.replace(/\./g, '_') // prev to eslint, is it right? /\./g
  // payload.id = payload.id.replace(/%/g, 'percentage_') // prev to eslint, is it right? /\%/g

  Vue.set(state, payload.id, payload)
}

// export const append = (state, payload) => {
//   // if(payload.id.indexOf('.')> -1)
//   // payload.id = payload.id.replace(/\./g, '_') // prev to eslint, is it right? /\./g
//   // payload.id = payload.id.replace(/%/g, 'percentage_') // prev to eslint, is it right? /\%/g
//
//   Vue.set(state[payload.id], payload.key, payload.data)
// }

export const del = (state, id) => {
  Vue.set(state, id, undefined)
  delete state[id]
}

export const clear = (state) => {
  Object.each(state, function (stat, id) {
    Vue.set(state, id, undefined)
    delete state[id]
  })
}
