import * as Debug from 'debug'
const debug = Debug('apps:checks:sources:store')

// const nginx_checks_enabled = {
//   params: {
//     path: 'all',
//     query: {
//       'from': 'checks',
//       'index': false,
//       'q': [
//         'data',
//         { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
//       ]
//       // 'filter': [ { 'metadata': { 'path': 'checks.nginx.enabled' } } ]
//     }
//   },
//   callback: function (tables, metadata, key, vm) {
//     debug('STORE callback', tables, this)
//     this.some_data.test = false
//   }
// }

const store = [
  // nginx_checks_enabled
]

// export { periodical, once, nginx_checks_error }
export default store
