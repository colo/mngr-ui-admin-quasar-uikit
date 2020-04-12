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
const debug = Debug('apps:logs:web:components:worldMap')

import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated)
// Themes end

import { countries, continents } from '@apps/logs/web/data/world'

export default {

  name: 'WorldMap',

  colorSet: new am4core.ColorSet(),
  imageSeries: undefined,

  chart: {},

  props: {
    // host: {
    //   type: String,
    //   default: ''
    // },
    cities: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {
      // chart: {}
    }
  },
  watch: {
    'cities': function (data) {
      let self = this
      data = JSON.parse(JSON.stringify(data))
      let _data = []
      Array.each(data, function (city) {
        // city.color = self.$options.colorSet.next()
        city.color = self.$options.colorSet.getIndex(16)
        // debug('cities %o', city, { 'color': self.$options.colorSet.next() })
        _data.push(city)
      })

      this.$options.imageSeries.data = _data
      debug('cities %o', data)
    }
  },
  mounted () {
    let chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart)
    chart.projection = new am4maps.projections.Miller()
    // Create map polygon series for world map
    let worldSeries = chart.series.push(new am4maps.MapPolygonSeries())
    worldSeries.useGeodata = true
    worldSeries.geodata = am4geodata_worldLow
    // Exclude Antartica
    worldSeries.exclude = ['AQ']

    let worldPolygon = worldSeries.mapPolygons.template
    worldPolygon.tooltipText = '{name}'
    // worldPolygon.nonScalingStroke = true
    worldPolygon.strokeOpacity = 0.6
    // worldPolygon.fill = am4core.color('#eee')
    // worldPolygon.propertyFields.fill = 'color'

    let hs = worldPolygon.states.create('hover')
    // hs.properties.fill = chart.colors.getIndex(9)
    hs.properties.fill = chart.colors.getIndex(0)

    /**
    * @start
    **/
    // Add image series
    this.$options.imageSeries = chart.series.push(new am4maps.MapImageSeries())
    this.$options.imageSeries.mapImages.template.propertyFields.longitude = 'longitude'
    this.$options.imageSeries.mapImages.template.propertyFields.latitude = 'latitude'
    this.$options.imageSeries.mapImages.template.tooltipText = '{title}'
    this.$options.imageSeries.mapImages.template.propertyFields.url = 'url'

    let circle = this.$options.imageSeries.mapImages.template.createChild(am4core.Circle)
    circle.radius = 3
    circle.propertyFields.fill = 'color'

    let circle2 = this.$options.imageSeries.mapImages.template.createChild(am4core.Circle)
    circle2.radius = 3
    circle2.propertyFields.fill = 'color'

    circle2.events.on('inited', function (event) {
      this.animateBullet(event.target)
    }.bind(this))

    /**
    * @end
    **/

    // removed country zoom
    // Create country specific series (but hide it for now)
    // let countrySeries = chart.series.push(new am4maps.MapPolygonSeries())
    // countrySeries.useGeodata = true
    // countrySeries.hide()
    // countrySeries.geodataSource.events.on('done', function (ev) {
    //   worldSeries.hide()
    //   countrySeries.show()
    // })
    //
    // let countryPolygon = countrySeries.mapPolygons.template
    // countryPolygon.tooltipText = '{name}'
    // countryPolygon.nonScalingStroke = true
    // countryPolygon.strokeOpacity = 0.5
    // countryPolygon.fill = am4core.color('#eee')
    //
    // let hsStates = countryPolygon.states.create('hover')
    // hsStates.properties.fill = chart.colors.getIndex(9)
    //
    // // Set up click events
    // worldPolygon.events.on('hit', function (ev) {
    //   ev.target.series.chart.zoomToMapObject(ev.target)
    //   let map = ev.target.dataItem.dataContext.map
    //   if (map) {
    //     ev.target.isHover = false
    //     countrySeries.geodataSource.url = 'https://www.amcharts.com/lib/4/geodata/json/' + map + '.json'
    //     countrySeries.geodataSource.load()
    //   }
    // })

    // Set up data for countries
    let data = []
    for (let id in countries) {
      if (countries.hasOwnProperty(id)) {
        let country = countries[id]
        if (country.maps.length) {
          data.push({
            id: id,
            color: chart.colors.getIndex(continents[country.continent_code]),
            map: country.maps[0]
          })
        }
      }
    }
    worldSeries.data = data

    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl()

    let homeButton = new am4core.Button()
    homeButton.events.on('hit', function () {
      worldSeries.show()
      // countrySeries.hide() //removed country zoom
      chart.goHome()
    })

    homeButton.icon = new am4core.Sprite()
    homeButton.padding(7, 5, 7, 5)
    homeButton.width = 30
    homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8'
    homeButton.marginBottom = 10
    homeButton.parent = chart.zoomControl
    homeButton.insertBefore(chart.zoomControl.plusButton)

    this.$options.chart = chart
  },
  methods: {
    animateBullet: function (circle) {
      let animation = circle.animate([{ property: 'scale', from: 1, to: 5 }, { property: 'opacity', from: 1, to: 0 }], 1000, am4core.ease.circleOut)
      // removed constant animation
      // animation.events.on('animationended', function (event) {
      //   this.animateBullet(event.target.object)
      // }.bind(this))
    }
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
  height: 400px;
}
</style>
