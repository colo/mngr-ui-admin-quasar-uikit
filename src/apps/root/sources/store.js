import * as Debug from 'debug'
const debug = Debug('apps:root:sources:store')

const nginx_vhosts_error = {
  params: {
    path: 'all',
    // query: 'all?from=educativa&index=host&filter%5B0%5D=r.row%28%27metadata%27%29%28%27tag%27%29.contains%28%27enabled%27%29.and%28%27nginx%27%29.and%28%27vhost%27%29&filter%5B1%5D=r.row%28%27data%27%29%28%27code%27%29.gt%28399%29&filter%5B2%5D=r.row%28%27metadata%27%29%28%27path%27%29.eq%28%27educativa.checks.vhosts%27%29&filter%5B3%5D=r.row%28%27metadata%27%29%28%27type%27%29.eq%28%27check%27%29&filter%5B4%5D=r.row%28%27metadata%27%29%28%27host%27%29.eq%28%27colo%27%29'
    query: {
      'from': 'educativa',
      'index': 'host',
      'filter': [
        "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
        "r.row('data')('code').gt(399)",
        "r.row('metadata')('path').eq('educativa.checks.vhosts')",
        "r.row('metadata')('type').eq('check')"
        // "r.row('metadata')('host').eq('colo')"
      ]
    }
  },
  callback: function (tables, metadata, key, vm) {
    debug('STORE callback', tables, this)
    this.some_data.test = false
  }
}

const store = [
  nginx_vhosts_error
]

// export { periodical, once, nginx_vhosts_error }
export default store
