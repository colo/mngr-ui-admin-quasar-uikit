<template>

  <vk-card class="uk-background-secondary uk-light">
    <vk-card-title>
      <!-- <q-btn flat color="primary" :label="host" :to="{name: 'munin_host', params: host}"/> -->
      <router-link :to="'/munin/hosts/'+host" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <h3 class="uk-light"><a class="uk-link-heading" :href="href" @click="navigate">{{host}}</a></h3>
      </router-link>

    </vk-card-title>

    <ul class="uk-subnav uk-subnav-divider" uk-margin>
      <li v-for="category in categories" :key="host+'.'+category">
        <!-- <q-btn flat color="primary" :label="category" :to="{name: 'munin_host', params: host, hash: '#'+category}"/> -->
        <router-link :to="'/munin/hosts/'+host+'#'+category" v-slot="{ href, route, navigate, isActive, isExactActive }">
          <a :href="href" @click="navigate">{{category}}</a>
        </router-link>
      </li>
    </ul>
  </vk-card>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:components:hostCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/munin/pipelines/index'

// import DataSourcesMixin from '@components/mixins/dataSources'

// import { requests, store } from './sources/index'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,

  name: 'MuninHostCard',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,
  props: {
    host: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {

    }
  }

}
</script>
