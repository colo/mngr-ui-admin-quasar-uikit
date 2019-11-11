'use strict'

import os_freemem_chart from 'mngr-ui-admin-charts/os/freemem'

/**
* use stat.path on rethinkdb (faster), does a range call for each
* on couchdb grouping all (seting stat.path = undefined) is faster
*/
// export default {
let __payloads = {
  'os_freemem': {
    chart: os_freemem_chart
  },

  /**
  * @test - merged stats
  */
  // 'merged':{
  //   name: 'merged',
  //   chart: undefined,
  //   init: undefined,
  //   stop: undefined,
  //   wrapper: {
  //     type: 'dygraph',
  //     props: {}
  //   },
  //   stat: {
  //     merged: true,
  //     sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.uptime'}],
  //     // sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.loadavg'}],
  //     events: [{
  //       host: undefined,
  //       path: 'os.cpus',
  //       tabular: true,
  //     },
  //     {
  //       host: undefined,
  //       path: 'os.uptime',
  //       tabular: true,
  //     }]
  //   },
  //   /**
  //   * for __get_stat_for_chart
  //   **/
  //   pipeline: {
  //     name: 'input.os',
  //     // // path: 'os',
  //     // range: true
  //   }
  // },
  /**
  * @test - merged stats
  */
  'os.cpus.percentage': {
    name: 'os.cpus.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{ type: 'tabular', path: '_os_cpus_percentage' }],
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os'
      // // path: 'os',
      // range: true
    }
  },

  'os.cpus.times': {
    name: 'os.cpus.times',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{ type: 'tabular', path: '_os_cpus_times' }],
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os'
      // // path: 'os',
      // range: true
    }
  },

  'os.uptime': {
    name: 'os.uptime',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{ type: 'tabular', path: '_os_uptime' }],

      events: [{
        host: undefined,
        path: 'os.uptime',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os.loadavg': {
    name: 'os.loadavg',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{ type: 'tabular', path: '_os_loadavg' }],
      events: [{
        host: undefined,
        path: 'os.loadavg',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs_stats': {
    name: 'os_procs_stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: true,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      // sources: [{type: 'stat', path:'.os_procs_stats.kernel'}, {type: 'stat', path: '.os_procs_stats.user'}],
      // sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: 'os_procs_stats',
        tabular: true
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs_cmd_stats': {
    name: 'os_procs_cmd_stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: true,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      // sources: [{type: 'stat', path:'.os_procs_stats.kernel'}, {type: 'stat', path: '.os_procs_stats.user'}],
      // sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: 'os_procs_cmd_stats',
        tabular: true
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs_uid_stats': {
    name: 'os_procs_uid_stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: true,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      // sources: [{type: 'stat', path:'.os_procs_stats.kernel'}, {type: 'stat', path: '.os_procs_stats.user'}],
      // sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: 'os_procs_uid_stats',
        tabular: true
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'munin': {
    name: 'munin',
    chart: undefined,
    init: undefined,
    stop: undefined,
    // tabular: true,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: true,
      sources: [],
      // sources: [{type: 'stat', path:'.os_procs_stats.kernel'}, {type: 'stat', path: '.os_procs_stats.user'}],
      // sources: [{type: 'tabular', path:'.os.cpus.times'}, {type: 'tabular', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: undefined,
        tabular: true
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  // 'os_procs.count.pids': {
  //   name: 'os_procs.count.pids',
  //   chart: undefined,
  //   init: undefined,
  //   stop: undefined,
  //   wrapper: {
  //     type: 'dygraph',
  //     props: {}
  //   },
  //   stat: {
  //     merged: false,
  //     sources: [{type: 'tabular', path:'_os_procs_count_pids'}],
  //
  //     events: [{
  //       host: undefined,
  //       path: 'os_procs',
  //       // key: 'cpus',
  //       // length: 300,
  //       tabular: true,
  //       // range: undefined
  //     }]
  //   },
  //   /**
  //   * for __get_stat_for_chart
  //   **/
  //   pipeline: {
  //     name: 'input.os',
  //     // // path: 'os',
  //     range: true
  //   }
  // },
  //
  // 'os_procs.count.cmd': {
  //   name: 'os_procs.count.cmd',
  //   chart: undefined,
  //   init: undefined,
  //   stop: undefined,
  //   wrapper: {
  //     type: 'dygraph',
  //     props: {}
  //   },
  //   stat: {
  //     merged: false,
  //     sources: [{type: 'tabular', path:'_os_procs_count_cmd'}],
  //
  //     events: [{
  //       host: undefined,
  //       path: 'os_procs',
  //       // key: 'cpus',
  //       // length: 300,
  //       tabular: true,
  //       // range: undefined
  //     }]
  //   },
  //   /**
  //   * for __get_stat_for_chart
  //   **/
  //   pipeline: {
  //     name: 'input.os',
  //     // // path: 'os',
  //     range: true
  //   }
  // },
  //
  // 'os_procs.count.uids': {
  //   name: 'os_procs.count.uids',
  //   chart: undefined,
  //   init: undefined,
  //   stop: undefined,
  //   wrapper: {
  //     type: 'dygraph',
  //     props: {}
  //   },
  //   stat: {
  //     merged: false,
  //     sources: [{type: 'tabular', path:'_os_procs_count_uids'}],
  //
  //     events: [{
  //       host: undefined,
  //       path: 'os_procs',
  //       // key: 'cpus',
  //       // length: 300,
  //       tabular: true,
  //       // range: undefined
  //     }]
  //   },
  //   /**
  //   * for __get_stat_for_chart
  //   **/
  //   pipeline: {
  //     name: 'input.os',
  //     // // path: 'os',
  //     range: true
  //   }
  // },
  //
  // 'os_procs_stats.uids':{
  //   name: 'os_procs_stats.uids',
  //   chart: undefined,
  //   init: undefined,
  //   stop: undefined,
  //   tabular: false,//this is for component, if not set is "chart-tabular"
  //   wrapper: {
  //     type: 'dygraph',
  //     props: {}
  //   },
  //   stat: {
  //     merged: false,
  //     sources: [{type: 'stat', path: '_os_procs_stats_uids'}],
  //     events: [{
  //       host: undefined,
  //       path: 'os_procs_stats',
  //       // key: 'cpus',
  //       // length: 300,
  //       tabular: false,
  //       // range: undefined
  //     }]
  //   },
  //   /**
  //   * for __get_stat_for_chart
  //   **/
  //   pipeline: {
  //     name: 'input.os',
  //     // // path: 'os',
  //     range: true
  //   }
  // },
  'os_blockdevices.stats': {
    name: 'os_blockdevices.stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_blockdevices',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.blockdevices',
      range: true
    }
  },

  'os_mounts.percentage': {
    name: 'os_mounts.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_mounts',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.mounts',
      range: true
    }
  },

  'os.freemem': {
    name: 'os.freemem',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: false, // this is for component, if not set is "chart-tabular"
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{ type: 'stat', path: '_os_freemem' }],
      events: [{
        host: undefined,
        path: 'os.freemem',
        // key: 'cpus',
        // length: 300,
        tabular: false
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_networkInterfaces_stats.properties': {
    name: 'os_networkInterfaces_stats.properties',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_networkInterfaces_stats',
        // key: 'cpus',
        // length: 300,
        tabular: true
        // range: undefined
      }]
    },
    // watcher: undefined,
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os'
      // // path: 'os.networkInterfaces_stats',
      // range: true
    }
  }

}

export default function (payload) {
  console.log('host_charts_payloads func', payload)
  let { host, seconds, range } = payload
  let payloads = Object.clone(__payloads)
  Object.each(payloads, function (chart, key) {
    if (chart.name) {
      chart.name = host + '.' + chart.name
      chart.name = chart.name.replace(/\./g, '_')
    }

    if (chart.stat) {
      chart.stat.range = range || chart.stat.range
      chart.stat.length = seconds || chart.stat.length

      if (chart.stat.events && !Array.isArray(chart.stat.events)) { chart.stat.events = [chart.stat.events] }

      if (chart.stat.events) {
        Array.each(chart.stat.events, function (event) {
          event.host = host
        // event.length = seconds || event.length
        // event.range = range || event.range
        })
      }

      if (chart.stat.sources && !Array.isArray(chart.stat.sources)) { chart.stat.sources = [chart.stat.sources] }

      if (chart.stat.sources) {
        Array.each(chart.stat.sources, function (source) {
          source.path = host + source.path
        })
      }
    }
  })
  return payloads
}
