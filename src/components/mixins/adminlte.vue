<script>
/* eslint-disable */
import '@components/adminlte/index'

import * as Debug from 'debug'
const debug = Debug('components:mixins:AdminLte')

// import Vue from 'vue';
// export const EventBus = new Vue();

import { dom } from 'quasar'
const { ready } = dom

export default {
  name: 'admin-lte-mixin',

  components: {

  },

  data () {
    return {
      // EventBus: EventBus
    }
  },

  mounted: function(){
    debug('mounted')
    ready(this.admin_lte_ui())
  },
  // mounted () {
  //   this.admin_lte_ui()
  // },
  updated: function () {
    this.admin_lte_ui()
  },
  methods: {
    saveNewOrder: function(e, ui) {
      debug('saveNewOrder', e, ui)
      this.EventBus.$emit('sortable', [e,ui])
    //   // let $sortable = $('.connectedSortable')
    //   // let positions = JSON.stringify($sortable.sortable("toArray"));
    //   // localStorage.setItem('positions', positions);
    },
    // https://stackoverflow.com/questions/44134147/vue-js-removes-jquery-event-handlers
    admin_lte_ui: function () {
      $(document).trigger('vue-loaded')

      // Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
      jQuery.widget.bridge('uibutton', jQuery.ui.button)

      // console.log('admin-lte this.$route',this.$route)

      // let $sortable = $('.connectedSortable')
      // var positions = JSON.parse(localStorage.getItem('positions'));
      // if (positions) {
      //   $.each(positions, function(i, position) {
      //     let $target = $sortable.find('#' + position);
      //     $target.appendTo($sortable); // or prependTo for reverse
      //   });
      // }

      // Make the dashboard widgets sortable Using jquery UI
      $('.connectedSortable').sortable({
        placeholder: 'sort-highlight',
        connectWith: '.connectedSortable',
        handle: '.box-header, .nav-tabs',
        forcePlaceholderSize: true,
        zIndex: 999999,
        // update: this.saveNewOrder.bind(this)
        // update: (e, ui) => this.$emit('sortable', [e,ui])
      })
      $('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move')

      $('.box').boxWidget({
        animationSpeed: 300
      })
    }
  }
}

// import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
