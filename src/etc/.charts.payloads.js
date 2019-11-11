'use strict'

/**
* use stat.path on rethinkdb (faster), does a range call for each
* on couchdb grouping all (seting stat.path = undefined) is faster
*/
export default {
  'os.cpus.percentage': {
    name: 'os.cpus.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
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
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      // range: true
    }
  },

  'os.uptime': {
    name: 'os.uptime',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os.uptime',
        // key: 'cpus',
        // length: 300,
        tabular: true,
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
    //
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os.loadavg',
        // key: 'cpus',
        // length: 300,
        tabular: true,
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

  'os_blockdevices.stats': {
    name: 'os_blockdevices.stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_blockdevices',
        // key: 'cpus',
        // length: 300,
        tabular: true,
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
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_mounts',
        // key: 'cpus',
        // length: 300,
        tabular: true,
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

  'os.freemem':{
    name: 'os.freemem',
    chart: undefined,
    init: undefined,
    stop: undefined,

    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os.freemem',
        // key: 'cpus',
        // length: 300,
        tabular: false,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      // range: true
    }
  },

  'os_networkInterfaces_stats.properties': {
    name: 'os_networkInterfaces_stats.properties',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_networkInterfaces_stats',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    // watcher: undefined,
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.networkInterfaces_stats',
      // range: true
    }
  }

}
