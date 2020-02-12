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

      <router-link to="/logs" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item :href="href" @click="navigate">Logs</vk-breadcrumb-item>
      </router-link>

      <router-link to="/logs/webs" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item v-bind="(!web) ? {'disabled' : true} : ''" :href="href" @click="navigate">Webs</vk-breadcrumb-item>
      </router-link>

      <vk-breadcrumb-item v-if="web">{{web}}</vk-breadcrumb-item>

    </vk-breadcrumb>

    <!-- <router-link
      to="/logs/categories"
      v-slot="{ href, route, navigate, isActive, isExactActive }"
    >

      <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Categories</vk-button-link>
    </router-link> -->

    </vk-card>

    <template v-for="(web_paths, web_name) in webs_paths">
      <os-web-card
        :key="web_name"
        v-if="!web || web_name === web"
        :categories="web_paths"
        :web="web_name"
      />
    </template>

    <router-view :key="$route.path"></router-view>

    <template v-for="(web_paths, web_name) in webs_paths">
      <os-web-card
        :key="web_name+'.bottom'"
        v-if="web_name === web"
        :categories="web_paths"
        :web="web_name"
      />
    </template>

    <!-- <template v-for="(web_paths, web_name) in webs_paths">
      <os-web-card
        :key="web_name"
        v-if="!web"
        :categories="web_paths"
        :web="web_name"
      />
      <q-page-sticky v-else position="top" :key="web_name+'.sticky'">
        <os-web-card
          v-if="web_name === web"
          :categories="web_paths"
          :web="web_name"
        />
      </q-page-sticky>
    </template> -->

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
    <!-- v-if="!web || web_name === web" -->

     <!-- :key="$route.fullPath" -->
    <!-- <vk-card class="uk-background-secondary uk-light" v-for="(categories, web) in webs_paths" :key="web">

      <vk-card-title>
        <router-link :to="'/logs/webs/'+web" v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <h3 class="uk-light"><a class="uk-link-heading" :href="href" @click="navigate">{{web}}</a></h3>
        </router-link>

      </vk-card-title>

      <ul class="uk-subnav uk-subnav-divider" uk-margin>
        <li v-for="category in categories" :key="web+'.'+category">
          <router-link :to="'/logs/webs/'+web+'#'+category" v-slot="{ href, route, navigate, isActive, isExactActive }"
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
const debug = Debug('apps:os:pages:webs')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/logs/pipelines/webs'

import DataSourcesMixin from '@components/mixins/dataSources'

import LogsWebCard from '@apps/logs/components/webCard.vue'

import { requests, store } from '@apps/logs/sources/webs/index'

export default {
  mixins: [DataSourcesMixin],
  components: { LogsWebCard },
  // extends: DataSourcesMixin,

  name: 'LogsWebs',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      // web: undefined,
      webs_paths: {},
      paths: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.logs.webs',

      id: 'logs.webs',
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
    'web': function () {
      return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.logs.webs'] && this.$options.pipelines['input.logs.webs'].get_input_by_id('input.logs.webs')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.logs.webs'].get_input_by_id('input.logs.webs').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.logs.webs'].get_input_by_id('input.logs.webs').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.logs.webs'].get_input_by_id('input.logs.webs').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.logs.webs'].get_input_by_id('input.logs.webs').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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
