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

    <!-- <template v-for="(web_paths, web_name) in webs_paths">
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
    </template> -->

    <router-view :key="$route.path"></router-view>

    <vk-card class="uk-background-secondary">
      <!-- <div class="uk-overflow-auto">
      <vk-table :data="vhosts" hoverable narrowed  :divided="false" :sorted-by.sync="sortedBy">
        <vk-table-column-sort title="URI" cell="uri" linked></vk-table-column-sort>
        <vk-table-column title="Prot" cell="port"></vk-table-column>
        <vk-table-column title="Schema" cell="schema"></vk-table-column>
        <vk-table-column title="Host" cell="host"></vk-table-column>
        <vk-table-column title="Last Update" cell="timestamp"></vk-table-column>
        <vk-table-column title="Type" cell="path"></vk-table-column>
      </vk-table>
      </div> -->
      <q-table
        v-if="!web"
        class="my-sticky-header-table"
        title="Web Logs"
        :data="webs"
        :columns="columns"
        :row-key="row => row.domain +'.'+ row.host +'.'+ row.path"
        :pagination.sync="pagination"
        virtual-scroll
        :rows-per-page-options="[0]"
        dark
        color="amber"
        :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
        :loading="loading"
        :filter="filter"
      >
        <template v-slot:top="props">
          <q-select
            v-if="$q.screen.lt.sm"
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />
          <q-space />
          <!-- <div v-if="$q.screen.gt.xs" class="col">
            <q-toggle v-model="visibleColumns" val="schema" label="Schema" />
            <q-toggle v-model="visibleColumns" val="uri" label="URI" />
            <q-toggle v-model="visibleColumns" val="port" label="Port" />
            <q-toggle v-model="visibleColumns" val="host" label="Host" />
            <q-toggle v-model="visibleColumns" val="timestamp" label="Last Update" />
            <q-toggle v-model="visibleColumns" val="path" label="Type" />
          </div> -->

          <q-input borderless dense debounce="100" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
        </template>

        <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="domain" :props="props">
            {{ props.row.domain }}
            <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
            <q-btn :to="'/logs/webs/?domain=' + props.row.domain" flat icon="open_in_new" />
          </q-td>

          <q-td key="host" :props="props">
            {{ props.row.host }}

            <q-btn :to="'/logs/webs/?host=' + props.row.host" flat icon="open_in_new" />
          </q-td>
          <!-- <q-td key="timestamp" :props="props">
            {{ format_time(props.row.timestamp) }}
          </q-td> -->
          <q-td key="path" :props="props">
            {{ props.row.path }}

            <q-btn :to="'/logs/webs/?path=' + props.row.path" flat icon="open_in_new" />
          </q-td>
        </q-tr>
        </template>
      </q-table>
    </vk-card>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

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

// import LogsWebCard from '@apps/logs/components/webCard.vue'

import { requests, store } from '@apps/logs/sources/webs/index'

export default {
  mixins: [DataSourcesMixin],
  // components: { LogsWebCard },
  // extends: DataSourcesMixin,

  name: 'LogsWebs',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      webs: [],

      filter: '',
      loading: true,
      allColumns: ['domain', 'host', 'path'],
      visibleColumns: ['domain'],
      pagination: {
        rowsPerPage: 50
      },

      columns: [
        // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'domain',
          required: true,
          label: 'Domain',
          align: 'left',
          field: 'domain',
          sortable: true
        },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        // {
        //   name: 'timestamp',
        //   align: 'left',
        //   label: 'Last Update',
        //   field: 'timestamp',
        //   sortable: true
        // },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      ],

      // web: undefined,
      // webs_paths: {},
      // paths: [],
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
  // computed: {
  //   'web': function () {
  //     // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
  //     return (this.$route && this.$route.query)
  //       ? (this.$route.query.domain) ? this.$route.query.domain : (this.$route.query.host) ? this.$route.query.host : this.$route.query.path
  //       : undefined
  //   }
  // },
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

<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height: 600px
    // min-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #1d1d1d

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
