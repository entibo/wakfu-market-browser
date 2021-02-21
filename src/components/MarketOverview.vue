<template>
  <div>
    <v-container>
      <apex-chart type="line" height="350" :series="series" :options="chartOptions" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { ApexOptions } from "apexcharts"
import VueApexCharts from "vue-apexcharts"
import * as csv from "@/csv"

export default Vue.extend({
  components: {
    ApexChart: VueApexCharts,
  },
  data() {
    return {
      series: [] as ApexAxisChartSeries,
      chartOptions: {
        chart: {
          
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Nombre d'offres",
          align: "left",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          /* categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], */
          type: "datetime",
          /* title: {
            text: "Month",
          }, */
        },
        yaxis: {
          title: {
            text: "Temperature",
          },
          show: false,
          /* min: 5,
          max: 40, */
        },
        /* legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        }, */
      } as ApexOptions,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const scans = await fetch("https://entibo.github.io/wakfu-market-data/pandora/scans.csv")
        .then((resp) => resp.text())
        .then(csv.decode)
      console.log("Data fetched!")
      this.series = [
        {
          name: "Offres",
          data: scans.map((row) => ({x: row.time, y:row.entryCount})),
        },
        /* {
          name: "Personnages",
          data: scans.map((row) => ({x: row.time, y:row.playerCount})),
        }, */
      ]
    },
  },
})
</script>
