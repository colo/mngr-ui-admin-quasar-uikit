<template>

  <div id="chartdiv" ref="chartdiv"></div>
  <!-- <vk-card class="uk-background-secondary uk-light">

    <vk-card-title>

      <router-link :to="'/os/hosts/'+host" v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <h3 class="uk-light"><a class="uk-link-heading" :href="href" @click="navigate">{{host}}</a></h3>
      </router-link>

    </vk-card-title>

    <ul class="uk-subnav uk-subnav-divider" uk-margin>
      <li v-for="category in categories" :key="host+'.'+category">
        <router-link
          tag="a"
          :to="{
            name: 'os_host',
            params: { host: host },
            hash: '#'+category
          }"
          :class="'uk-scroll'"
        >
        {{category}}
        </router-link>
      </li>
    </ul>
  </vk-card> -->

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:barRace')

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated)
// Themes end

// import { countries, continents } from '@apps/logs/web/data/world'

export default {

  name: 'barRace',

  colorSet: new am4core.ColorSet(),
  // imageSeries: undefined,

  chart: undefined,
  label: undefined,
  categoryAxis: undefined,

  props: {
    stepDuration: {
      type: Number,
      default: 2000
    },
    label: {
      type: String,
      default: ''
    },
    categoryY: {
      type: String,
      default: ''
    },
    valueX: {
      type: String,
      default: ''
    },
    values: {
      type: [Array, Object],
      default: function () { return [] }
    }
    // host: {
    //   type: String,
    //   default: ''
    // },
    // cities: {
    //   type: Array,
    //   default: function () { return [] }
    // }
  },
  data () {
    return {
      // chart: {}
    }
  },
  watch: {
    values: {
      handler: function (newData) {
        newData = this.format_values(newData)

        if (newData.length > 0 && this.$options.chart === undefined) {
          this.init_chart(newData)
        } else if (newData.length > 0 && this.$options.chart !== undefined) {
          // let itemsWithNonZero = 0

          // if (this.$options.chart.data.length === 0) {
          //   this.$options.chart.data = newData
          //   this.$options.categoryAxis.zoom({ start: 0, end: 1 / newData.length })
          // } else {
          for (let i = 0; i < newData.length; i++) {
            let val = newData[i]
            let found = false
            for (let j = 0; j < this.$options.chart.data.length; j++) {
              if(val[this.categoryY] === this.$options.chart.data[j][this.categoryY]){
                this.$options.chart.data[j] = val
                found = true
              }
            }
            if(found === false){
              this.$options.chart.data.push(val)
            }
            // this.$options.chart.data[i] = newData[i]
            // if (val[this.valueX] > 0) {
            //   itemsWithNonZero++
            // }
          }

          // debug('values %o', this.$options.chart.data, this.$options.categoryAxis.dataItems)

          // if (year == 2003) {
          //   series.interpolationDuration = stepDuration / 4;
          //   valueAxis.rangeChangeDuration = stepDuration / 4;
          // }
          // else {
          // series.interpolationDuration = stepDuration
          // valueAxis.rangeChangeDuration = stepDuration
          // }

          this.$options.chart.invalidateRawData()
          // label.text = year.toString()

          // this.$options.categoryAxis.zoom({ start: 0, end: itemsWithNonZero / this.$options.chart.data.length })
          // this.$options.categoryAxis.zoom({ start: 0, end: 1 / this.$options.chart.data.length })
          // }
        }
      },
      deep: true
    }
    // 'cities': function (data) {
    //   let self = this
    //   data = JSON.parse(JSON.stringify(data))
    //   let _data = []
    //   Array.each(data, function (city) {
    //     // city.color = self.$options.colorSet.next()
    //     city.color = self.$options.colorSet.getIndex(16)
    //     // debug('cities %o', city, { 'color': self.$options.colorSet.next() })
    //     _data.push(city)
    //   })
    //
    //   this.$options.imageSeries.data = _data
    //   debug('cities %o', data)
    // }
  },
  mounted () {
    let newData = this.format_values(this.values)
    if (newData.length > 0) {
      this.init_chart(newData)
    }
  },
  methods: {
    format_values: function (newData) {
      newData = JSON.parse(JSON.stringify(newData))

      if (!Array.isArray(newData)) {
        let _newData = []
        Object.each(newData, function (val, prop) {
          let _obj = {}
          _obj[this.categoryY] = prop
          _obj[this.valueX] = val
          _newData.push(_obj)
        }.bind(this))

        newData = Array.clone(_newData)
      }

      debug('values %o', newData)
      return newData
    },

    init_chart: function (newData) {
      this.$options.chart = am4core.create('chartdiv', am4charts.XYChart)
      this.$options.chart.padding(40, 40, 40, 40)

      // this.$options.chart.numberFormatter.bigNumberPrefixes = [
      //   { 'number': 1e+3, 'suffix': 'K' },
      //   { 'number': 1e+6, 'suffix': 'M' },
      //   { 'number': 1e+9, 'suffix': 'B' }
      // ]

      this.$options.label = this.$options.chart.plotContainer.createChild(am4core.Label)
      this.$options.label.x = am4core.percent(97)
      this.$options.label.y = am4core.percent(95)
      this.$options.label.horizontalCenter = 'right'
      this.$options.label.verticalCenter = 'middle'
      this.$options.label.dx = -15
      this.$options.label.fontSize = 50

      // let playButton = chart.plotContainer.createChild(am4core.PlayButton);
      // playButton.x = am4core.percent(97);
      // playButton.y = am4core.percent(95);
      // playButton.dy = -2;
      // playButton.verticalCenter = "middle";
      // playButton.events.on("toggled", function(event) {
      //   if (event.target.isActive) {
      //     play();
      //   }
      //   else {
      //     stop();
      //   }
      // })

      // let stepDuration = 4000

      this.$options.categoryAxis = this.$options.chart.yAxes.push(new am4charts.CategoryAxis())
      this.$options.categoryAxis.renderer.grid.template.location = 0
      this.$options.categoryAxis.dataFields.category = this.categoryY
      this.$options.categoryAxis.renderer.minGridDistance = 1
      this.$options.categoryAxis.renderer.inversed = true
      this.$options.categoryAxis.renderer.grid.template.disabled = true

      let valueAxis = this.$options.chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      valueAxis.rangeChangeEasing = am4core.ease.linear
      valueAxis.rangeChangeDuration = this.stepDuration
      valueAxis.extraMax = 0.1

      let series = this.$options.chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.categoryY = this.categoryY
      series.dataFields.valueX = this.valueX
      series.tooltipText = '{valueX.value}'
      // series.tooltipText = '{valueX.workingValue}'
      series.columns.template.strokeOpacity = 0
      series.columns.template.column.cornerRadiusBottomRight = 5
      series.columns.template.column.cornerRadiusTopRight = 5
      series.interpolationDuration = this.stepDuration
      series.interpolationEasing = am4core.ease.linear

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = 'right'
      // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}"
      labelBullet.label.text = '{values.valueX.workingValue}'
      labelBullet.label.textAlign = 'end'
      labelBullet.label.dx = -10

      this.$options.chart.zoomOutButton.disabled = true

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add('fill', function (fill, target) {
        return this.$options.chart.colors.getIndex(target.dataItem.index)
      }.bind(this))

      // let year = 2003
      this.$options.label.text = this.label
      // year.toString()

      // let interval

      // this.$options.chart = chart
      this.$options.categoryAxis.sortBySeries = series

      this.$options.chart.data = JSON.parse(JSON.stringify(newData))
      // this.$options.categoryAxis.zoom({ start: 0, end: 1 / this.$options.chart.data.length })

      series.events.on('inited', function () {
        debug('series init')
      })
    }
    // new_data: function (newData) {
    //   let itemsWithNonZero = 0
    //   for (let i = 0; i < newData.length; i++) {
    //     this.$options.chart.data[i] = newData[i]
    //     if (this.$options.chart.data[i][this.valueX] > 0) {
    //       itemsWithNonZero++
    //     }
    //   }
    //
    //   // if (year == 2003) {
    //   //   series.interpolationDuration = stepDuration / 4;
    //   //   valueAxis.rangeChangeDuration = stepDuration / 4;
    //   // }
    //   // else {
    //   // series.interpolationDuration = stepDuration
    //   // valueAxis.rangeChangeDuration = stepDuration
    //   // }
    //
    //   this.$options.chart.invalidateRawData()
    //   // label.text = year.toString()
    //
    //   this.$options.categoryAxis.zoom({ start: 0, end: itemsWithNonZero / this.$options.categoryAxis.dataItems.length })
    // }
  },
  beforeDestroy () {
    if (this.$options.chart) {
      this.$options.chart.dispose()
    }
  }

}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 500px;
}
</style>
