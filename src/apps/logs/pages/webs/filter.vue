<template>
  <q-page>
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
        <vk-breadcrumb-item :href="href" @click="navigate">Webs</vk-breadcrumb-item>
      </router-link>

      <!-- <router-link :to="'/logs/webs/filter/'+type" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <vk-breadcrumb-item v-bind="(!type) ? {'disabled' : true} : ''" :href="href" @click="navigate">{{type}}</vk-breadcrumb-item>
      </router-link> -->

      <vk-breadcrumb-item v-if="type">Filter</vk-breadcrumb-item>

      <vk-breadcrumb-item v-if="type && web">{{type}} : {{web}}</vk-breadcrumb-item>

      <!-- <vk-breadcrumb-item v-if="web">{{web}}</vk-breadcrumb-item> -->

    </vk-breadcrumb>

    </vk-card>

    <vk-card class="uk-background-secondary">
      periodical.total_bytes_sent: {{ periodical.total_bytes_sent }} <br/>
      periodical.hits: {{ periodical.hits }} <br/>

      <hr>

      periodical.current_bytes_sent: {{ periodical.current_bytes_sent }}

      <hr>

      <div v-for="(val, status) in periodical.status_counter" :key="status">
        periodical.status_counter: {{status}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, city) in periodical.city_counter" :key="city">
        periodical.city_counter: {{city}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, country) in periodical.country_counter" :key="country">
        periodical.country_counter: {{country}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, continent) in periodical.continent_counter" :key="continent">
        periodical.continent_counter: {{continent}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, os) in periodical.user_agent_os_counter" :key="os">
        periodical.user_agent_os_counter: {{os}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, os) in periodical.user_agent_os_family_counter" :key="os+'-'+val">
        periodical.user_agent_os_family_counter: {{os}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, engine) in periodical.user_agent_engine_counter" :key="engine+'-'+val">
        periodical.user_agent_engine_counter: {{engine}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, browser) in periodical.user_agent_browser_counter" :key="browser+'-'+val">
        periodical.user_agent_browser_counter: {{browser}} - {{val}} <br/>
      </div>

      <hr>

      <div v-for="(val, device) in periodical.user_agent_device_counter" :key="device+'-'+val">
        periodical.user_agent_device_counter: {{device}} - {{val}} <br/>
      </div>
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

      <!-- v-if="!web" -->
      <q-table
        class="my-sticky-header-table"
        title="Web Logs"
        :data="logs"
        :columns="columns"
        :row-key="row => row.timestamp + row.domain +'.'+ row.host +'.'+ row.path"
        :pagination.sync="pagination"
        virtual-scroll
        :rows-per-page-options="[0]"
        dark
        color="amber"
        :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
        :loading="loading_logs"
        :filter="search_filter"
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

          <q-input borderless dense debounce="100" v-model="search_filter" placeholder="Search">
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

          <q-td key="date" :props="props">
            {{ format_time(props.row.timestamp) }}
          </q-td>

          <q-td key="log" :props="props">
            {{ format_log(props.row.log) }}
          </q-td>

          <q-td key="domain" :props="props">
            {{ props.row.domain }}
            <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
            <q-btn :to="'/logs/webs/filter/?domain=' + props.row.domain" flat icon="open_in_new" />
          </q-td>

          <q-td key="host" :props="props">
            {{ props.row.host }}

            <q-btn :to="'/logs/webs/filter/?host=' + props.row.host" flat icon="open_in_new" />
          </q-td>

          <q-td key="path" :props="props">
            {{ props.row.path }}

            <q-btn :to="'/logs/webs/filter/?path=' + props.row.path" flat icon="open_in_new" />
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
import * as Debug from 'debug'
const debug = Debug('apps:logs:pages:webs:filter')

//

// let moment = require('moment')

// import OsPluginDygraph from '@apps/logs/components/pluginDygraph'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/logs/pipelines/webs/filter'

import { requests, store } from '@apps/logs/sources/webs/filter/index'

// const MAX_FEED_DATA = 10
import moment from 'moment'

export default {
  mixins: [DataSourcesMixin],

  // components: { OsPluginDygraph },

  name: 'LogsWebFilter',

  data () {
    return {
      id: 'logs.webs.filter',
      path: 'all',

      periodical: {
        total_bytes_sent: 0,
        hits: 0,

        current_bytes_sent: 0,

        status_counter: {},

        city_counter: {},
        country_counter: {},
        continent_counter: {},

        user_agent_os_counter: {},
        user_agent_os_family_counter: {},
        user_agent_engine_counter: {},
        user_agent_browser_counter: {},
        user_agent_device_counter: {}

      },

      store: false,
      pipeline_id: 'input.logs.webs.filter',

      logs: [],

      search_filter: '',
      loading_logs: true,
      allColumns: ['date', 'log', 'domain', 'host', 'path'],
      visibleColumns: ['log'],
      pagination: {
        rowsPerPage: 10
      },

      columns: [
        // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'timestamp',
          sortable: true
        },
        {
          name: 'log',
          required: true,
          label: 'Log',
          align: 'left',
          field: 'log',
          sortable: true
        },
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

      components: {
        range: {
          // source: {
          //   requests: {
          //     once: [],
          //     periodical: []
          //   }
          // }
          source: {
            requests: requests

            // store: store
          }
        }

      }
    }
  },

  computed: {
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      return (this.$route && this.$route.query)
        ? this.$route.query
        : undefined
    },
    'type': function () {
      return (this.filter) ? Object.keys(this.filter)[0] : undefined
    },
    'web': function () {
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    }
  },
  // computed: {
  //   'web': function () {
  //     return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
  //   },
  //   'type': function () {
  //     return (this.$route && this.$route.params && this.$route.params.type) ? this.$route.params.type : undefined
  //   }
  // },
  watch: {
    // 'plugins_config': function (val) {
    //   debug('watch plugins_config %o', val.graph)
    // }

    // 'periodical.total_bytes_sent': {
    //   handler: function(val){
    //       periodical_total_bytes_sent
    //   }
    //   deep:true
    // }

  },
  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.logs.webs.filter'] && this.$options.pipelines['input.logs.webs.filter'].get_input_by_id('input.os')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.logs.webs.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.logs.webs.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.logs.webs.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.logs.webs.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id
        // let pipeline_id = 'input.logs.webs.filter'

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

  // computed: {
  //
  // //   count: function () {
  // //     let result = 0
  // //     Array.each(this.groups, function (group) {
  // //       result += group.count
  // //     })
  // //
  // //     return result
  // //   }
  // },
  // mounted: function () {
  //   this.pipeline_id = 'input.logs.webs.filter'
  // },
  // create: function () {
  //   debug('created HOST %s %o %o', this.web, this.$options.range_component, this.$options.__pipelines_cfg)
  //   // EventBus.$on(this.pipeline_id, this.__process_input_data)
  //
  //   // if (this.store) this.__register_store_module(this.id, sourceStore)
  //   // this.__bind_components_to_sources(this.components)
  //   // this.create_pipelines()
  //
  //   // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.web = this.web
  //   // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.web = this.web
  //   // this.$set(this.components, 'range', this.$options.range_component)
  //   // this.$set(this.components, 'feed', this.$options.feed_component)
  //   // this.components.range.source.requests.once.push(this.$options.range_component)
  //
  //   this.components.range.source.requests.periodical.push(this.$options.range_component)
  // }

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
