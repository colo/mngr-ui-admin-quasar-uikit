<template>
  <router-view :key="$route.path"></router-view>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin')

export default {

  name: 'Munin',

  data () {
    return {

      id: 'munin',
      path: 'all'

    }
  },

  methods: {

  }
}
</script>
