import * as Debug from 'debug'
const debug = Debug('apps:munin:sources:store')

// const nginx_munin_enabled = {
//   params: {
//     path: 'all',
//     query: {
//       'from': 'munin',
//       'index': false,
//       'q': [
//         'data',
//         { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
//       ]
//       // 'filter': [ { 'metadata': { 'path': 'munin.nginx.enabled' } } ]
//     }
//   },
//   callback: function (tables, metadata, key, vm) {
//     debug('STORE callback', tables, this)
//     this.some_data.test = false
//   }
// }

const store = []

// export { periodical, once, nginx_munin_error }
export default store
