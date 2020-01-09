import * as Debug from 'debug'
const debug = Debug('apps:tf:sources:requests')

// const nginx_vhosts_error = {
//   params: {
//     path: 'all',
//     query: {
//       'from': 'educativa',
//       'index': 'host',
//       'filter': [
//         "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
//         "r.row('data')('code').gt(399)",
//         "r.row('metadata')('path').eq('educativa.checks.vhosts')",
//         "r.row('metadata')('type').eq('check')"
//         // "r.row('metadata')('host').eq('colo')"
//       ]
//     }
//   },
//   callback: function (tables, metadata, key, vm) {
//     debug('All callback', tables, JSON.parse(JSON.stringify(this)))
//   }
// }

const once = undefined
const periodical = [
  // nginx_vhosts_error
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, nginx_vhosts_error }
export default requests
