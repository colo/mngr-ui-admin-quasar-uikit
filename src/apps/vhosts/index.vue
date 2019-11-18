<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <vk-card class="uk-background-secondary">

      <router-link
        to="/"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Home</vk-button-link>
      </router-link>
    </vk-card>

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
        class="my-sticky-header-table"
        title="Vhosts"
        :data="vhosts"
        :columns="columns"
        :row-key="row => row.schema +'.'+ row.uri+'.'+ row.port +'.'+ row.host +'.'+ row.path "
        :pagination.sync="pagination"
        dark
        color="amber"
      />
    </vk-card>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:vhosts')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/vhosts/pipelines/index'

import DataSourcesMixin from '@components/mixins/dataSources'

import { requests, store } from './sources/index'

export default {
  mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,

  name: 'Vhosts',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      vhosts: [],
      pagination: {
        rowsPerPage: 100
      },
      columns: [
        { name: 'schema', label: 'Schema', field: 'schema', sortable: true },
        {
          name: 'asc',
          required: true,
          label: 'URI',
          align: 'center',
          field: 'uri',
          // field: row => row.name,
          // format: val => `${val}`,
          sortable: true
        },
        { name: 'port', align: 'center', label: 'Port', field: 'port', sortable: true },
        { name: 'host', label: 'Host', field: 'host', sortable: true },
        { name: 'timestamp', label: 'Last Update', field: 'timestamp', sortable: true },
        { name: 'path', label: 'Type', field: 'path', sortable: true }
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      // sortedBy: { uri: 'asc' },

      /**
      * dataSources
      **/
      store: true,
      pipeline_id: 'input.vhosts',

      id: 'vhosts',
      path: 'all',

      components: {
        'all': [
          {
            some_data: {
              test: true
            },
            source: {
              requests: requests,
              // requests: {
              //   periodical: [{
              //     params: {
              //       path: 'all',
              //       query: {
              //         'from': 'educativa',
              //         'index': 'host',
              //         'filter': [
              //           "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
              //           "r.row('data')('code').gt(399)",
              //           "r.row('metadata')('path').eq('educativa.checks.vhosts')",
              //           "r.row('metadata')('type').eq('check')",
              //           "r.row('metadata')('host').eq('colo')"
              //         ]
              //       }
              //     },
              //     callback: function (tables, metadata, key, vm) {
              //       debug('All callback', tables, vm.$options.grid_template)
              //     }
              //   }]
              // },

              store: store
              // store: [
              //   {
              //     params: {
              //       path: 'all',
              //       // query: 'all?from=educativa&index=host&filter%5B0%5D=r.row%28%27metadata%27%29%28%27tag%27%29.contains%28%27enabled%27%29.and%28%27nginx%27%29.and%28%27vhost%27%29&filter%5B1%5D=r.row%28%27data%27%29%28%27code%27%29.gt%28399%29&filter%5B2%5D=r.row%28%27metadata%27%29%28%27path%27%29.eq%28%27educativa.checks.vhosts%27%29&filter%5B3%5D=r.row%28%27metadata%27%29%28%27type%27%29.eq%28%27check%27%29&filter%5B4%5D=r.row%28%27metadata%27%29%28%27host%27%29.eq%28%27colo%27%29'
              //       query: {
              //         'from': 'educativa',
              //         'index': 'host',
              //         'filter': [
              //           "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
              //           "r.row('data')('code').gt(399)",
              //           "r.row('metadata')('path').eq('educativa.checks.vhosts')",
              //           "r.row('metadata')('type').eq('check')"
              //           // "r.row('metadata')('host').eq('colo')"
              //         ]
              //       }
              //     },
              //     callback: function (tables, metadata, key, vm) {
              //       debug('STORE callback', tables, vm.$options.grid_template)
              //     }
              //   }
              // ]
            }
          }
          // {
          //   source: {
          //     store: store
          //     // store: [
          //     //   {
          //     //     params: {
          //     //       path: 'all',
          //     //       // query: 'all?from=educativa&index=host&filter%5B0%5D=r.row%28%27metadata%27%29%28%27tag%27%29.contains%28%27enabled%27%29.and%28%27nginx%27%29.and%28%27vhost%27%29&filter%5B1%5D=r.row%28%27data%27%29%28%27code%27%29.gt%28399%29&filter%5B2%5D=r.row%28%27metadata%27%29%28%27path%27%29.eq%28%27educativa.checks.vhosts%27%29&filter%5B3%5D=r.row%28%27metadata%27%29%28%27type%27%29.eq%28%27check%27%29&filter%5B4%5D=r.row%28%27metadata%27%29%28%27host%27%29.eq%28%27colo%27%29'
          //     //       query: {
          //     //         'from': 'educativa',
          //     //         'index': 'host',
          //     //         'filter': [
          //     //           "r.row('metadata')('tag').contains('enabled').and('nginx').and('vhost')",
          //     //           "r.row('data')('code').gt(399)",
          //     //           "r.row('metadata')('path').eq('educativa.checks.vhosts')",
          //     //           "r.row('metadata')('type').eq('check')",
          //     //           "r.row('metadata')('host').eq('colo')"
          //     //         ]
          //     //       }
          //     //     },
          //     //     callback: function (tables, metadata, key, vm) {
          //     //       debug('STORE callback', tables, vm.$options.grid_template)
          //     //     }
          //     //   }
          //     // ]
          //   }
          // }
        ]
      }
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.vhosts'] && this.$options.pipelines['input.vhosts'].get_input_by_id('input.vhosts')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.vhosts'].get_input_by_id('input.vhosts').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.vhosts'].get_input_by_id('input.vhosts').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.vhosts'].get_input_by_id('input.vhosts').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.vhosts'].get_input_by_id('input.vhosts').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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
      max-height: 200px

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
