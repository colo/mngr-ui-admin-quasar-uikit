<template>

  <vk-card class="uk-background-secondary uk-light">
    <vk-card-title>
      <!-- <q-btn flat color="primary" :label="category" :to="{name: 'os_category', params: category}"/> -->
      <router-link :to="'/os/categories/'+category" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <h3 class="uk-light"><a class="uk-link-heading" :href="href" @click="navigate">{{category}}</a></h3>
      </router-link>

    </vk-card-title>

    <ul class="uk-subnav uk-subnav-divider" uk-margin>
      <li v-for="host in hosts" :key="category+'.'+host">
        <!-- <q-btn
          flat color="primary"
          :label="host"
          :to="{
            name: 'os_category',
            params: { category: category },
            hash: '#'+host
          }"
        /> -->

        <!-- <router-link :to="'/os/categories/'+category+'#'+host" v-slot="{ href, route, navigate, isActive, isExactActive }">
          <a :href="href" @click="navigate">{{host}}</a>
        </router-link> -->
        <router-link
          tag="a"
          :to="{
            name: 'os_category',
            params: { category: category },
            hash: '#'+host
          }"
          :class="'uk-scroll'"
        >
        {{host}}
        </router-link>
      </li>
    </ul>
  </vk-card>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:os:components:categoryCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/os/pipelines/index'

// import DataSourcesMixin from '@components/mixins/dataSources'

// import { requests, store } from './sources/index'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,

  name: 'OsCategoryCard',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,
  props: {
    category: {
      type: String,
      default: ''
    },
    hosts: {
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
