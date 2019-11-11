// export const paths = (state, payload) => {
//  if(Array.isArray(payload)){
//    state.paths = payload
//  }
//  else {
//    state.paths.push(payload)
//  }
// }

// import Vue from 'vue';

// export const doc = (state, payload) => {
//  if(!state.docs[payload.type])
//    Vue.set(state.docs, payload.type, null)
//
//  state.docs[payload.type] = payload.value
// }
//
// // export const search = (state, doc) => {
// //  state.docs.search = doc
// // }
//
// export const paths = (state, paths) => {
//   Array.each(paths, function(path){
//     if(!state.paths.contains(path))
//       state.paths.push(path)
//   })
//   Array.each(state.paths, function(path){
//     if(!paths.contains(path))
//       state.paths.erase(path)
//   })
//   // Vue.set(state, 'all', hosts)
// }

export const reset = (state, bool) => {
  state.reset = bool
}
export const suspend = (state, bool) => {
  state.suspend = bool
}
export const pause = (state, bool) => {
  state.pause = bool
}
export const freeze = (state, bool) => {
  state.freeze = bool
}

// import languages from 'quasar/lang/index.json';

import { AddressbarColor, colors } from 'quasar'

const { lighten, setBrand } = colors

export const setTheme = (state, theme) => {
  const palette = state.theme[theme]

  // this.$q.addressbarColor.set(palette.primary);
  AddressbarColor.set(palette.primary)// primary

  Object.keys(palette).map((name, index) => {
    const color = palette[name]
    // console.log(value);
    setBrand(name, color)
    setBrand(`${name}-darkened`, lighten(color, -50))
    return true
  })

  state.theme.current = theme
}

export const swapTheme = (state) => {
  const theme = (state.theme.current === 'slate') ? 'white' : 'slate'

  setTheme(state, theme)
}

// export const range = (state, range) => {
//   // console.log('range mutation', payload)
//   // state.range = [payload.start, payload.end]
//   state.range = range
// }

// export const charts_tree_menu = (state, menu) => {
//   state.charts_tree_menu = menu;
// };

// export const docs_per_sec = (state, docs) => {
//   state.docs_per_sec = docs
// }
