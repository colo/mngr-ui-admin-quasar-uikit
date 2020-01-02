<template>
  <q-page>
    <!-- <img alt="Vue logo" src="../../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <vk-card class="uk-background-secondary">

      <router-link
        to="/"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Home</vk-button-link>
      </router-link>
    </vk-card> -->

    <vk-card class="uk-background-secondary">
    <vk-breadcrumb>
      <router-link to="/" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Home</vk-breadcrumb-item>
      </router-link>

      <router-link to="/munin" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Munin</vk-breadcrumb-item>
      </router-link>

      <router-link to="/munin/categories" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item v-bind="(!category) ? {'disabled' : true} : ''" :href="href" @click="navigate">Categories</vk-breadcrumb-item>
      </router-link>

      <vk-breadcrumb-item v-if="category">{{category}}</vk-breadcrumb-item>

    </vk-breadcrumb>
    <router-link
      to="/munin/hosts"
      v-slot="{ href, route, navigate, isActive, isExactActive }"
    >

      <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Hosts</vk-button-link>
    </router-link>
    </vk-card>

    <template v-for="(category_hosts, category_name) in categories_paths">
      <os-category-card
        :key="category_name"
        v-if="!category || category_name === category"
        :hosts="category_hosts"
        :category="category_name"
      />
    </template>

    <router-view :key="$route.path"></router-view>

    <template v-for="(category_hosts, category_name) in categories_paths">
      <os-category-card
        :key="category_name+'.bottom'"
        v-if="category_name === category"
        :hosts="category_hosts"
        :category="category_name"
      />
    </template>

    <!-- <template v-for="(category_hosts, category_name) in categories_paths">
      <os-category-card
        :key="category_name"
        v-if="!category"
        :categories="category_hosts"
        :category="category_name"
      />
      <q-page-sticky v-else position="top" :key="category_name+'.sticky'">
        <os-category-card
          v-if="category_name === category"
          :categories="category_hosts"
          :category="category_name"
        />
      </q-page-sticky>
    </template> -->

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
    <!-- v-if="!category || category_name === category" -->

     <!-- :key="$route.fullPath" -->
    <!-- <vk-card class="uk-background-secondary uk-light" v-for="(categories, category) in categories_paths" :key="category">

      <vk-card-title>
        <router-link :to="'/munin/categories/'+category" v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <h3 class="uk-light"><a class="uk-link-heading" :href="href" @click="navigate">{{category}}</a></h3>
        </router-link>

      </vk-card-title>

      <ul class="uk-subnav uk-subnav-divider" uk-margin>
        <li v-for="category in categories" :key="category+'.'+category">
          <router-link :to="'/munin/categories/'+category+'#'+category" v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <a :href="href" @click="navigate">{{category}}</a>
          </router-link>
        </li>
      </ul>
    </vk-card> -->
  </q-page>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:pages:categories')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/categories'

import DataSourcesMixin from '@components/mixins/dataSources'

import OsCategoryCard from '@apps/munin/components/categoryCard.vue'

import { requests, store } from '@apps/munin/sources/categories/index'

export default {
  mixins: [DataSourcesMixin],
  components: { OsCategoryCard },
  // extends: DataSourcesMixin,

  name: 'MuninCategories',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      // category: undefined,
      categories_paths: {},
      paths: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.munin.categories',

      id: 'munin.categories',
      path: 'all',

      components: {
        'all': [
          {
            source: {
              requests: requests

              // store: store
            }
          }

        ]
      }
    }
  },
  computed: {
    'category': function () {
      return (this.$route && this.$route.params && this.$route.params.category) ? this.$route.params.category : undefined
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.munin.categories'] && this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id

        template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)

        let pipe = new JSPipeline(template)

        this.$options.__pipelines_cfg[pipeline_id] = {
          ids: [],
          connected: [],
          suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
        }

        // this.__after_connect_inputs(
        //   pipe,
        //   this.$options.__pipelines_cfg[pipeline_id],
        //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
        //     debug('__resume_pipeline CALLBACK')
        //     pipe.fireEvent('onOnce')
        //   }], this)
        // )

        this.$options.pipelines[pipeline_id] = pipe

        debug('create_pipelines %o', this.$options.pipelines)

        if (next) { next() }
      }
    }

    /**
    * @end pipelines
    **/

  }
}
</script>
