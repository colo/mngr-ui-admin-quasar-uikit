<template>
  <router-view :key="$route.path"></router-view>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:logs')

export default {

  name: 'Logs',

  data () {
    return {

      id: 'logs',
      path: 'all'

    }
  },

  methods: {

  }
}
</script>
