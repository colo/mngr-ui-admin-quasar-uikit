export default function () {
  return {
    theme: {
      current: 'white',
      white: {// white
        // primary: '#f8f8f8',
        // secondary: '#cdcdcd',
        secondary: '#ffffff',
        accent: '#567a9a',
        positive: '#66aa00',
        negative: '#dc3912',
        info: '#3366cc',
        warning: '#ffad33'
      },
      slate: {// slate
        primary: '#3a3f44',
        secondary: '#272B30',
        accent: '#17191b',
        positive: '#6ec86e',
        negative: '#ee605c',
        info: '#4bb9db',
        warning: '#f9a022'
      }
    },
    // docs: {
    //   count: null,
    //   search: null,
    //   os: null,
    // },
    // docs_per_sec: 0,
    // paths: [],

    /**
    *
    * */
    reset: false,
    suspend: false,
    pause: false,
    freeze: false
    /**
    *
    * */
    // range: [],
    // charts_tree_menu: [],
    // default_chart_icon: 'mdi-pulse',
    // icons: {
    //   'mdi-chart-line': /^os$/,
    //   'mdi-flash': /cpus.*/,
    //   'mdi-memory': /^.*mem.*$/,
    //   'mdi-clock': /minute.*/,
    //   'mdi-harddisk': /blockdevices.*|mounts.*/,
    //   'mdi-network': /networkInterfaces.*/
    //   // 'mdi-pulse': /.*/
    // },
  }
}
