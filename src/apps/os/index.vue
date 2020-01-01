<template>
  <router-view :key="$route.path"></router-view>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:os')

export default {

  name: 'OS',

  data () {
    return {

      id: 'os',
      path: 'all'

    }
  },

  methods: {

  }
}
</script>
