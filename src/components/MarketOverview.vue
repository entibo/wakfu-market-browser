<template>
  <div>
    <v-container>
      <apex-chart type="line" height="350" :series="series" :options="chartOptions" />

      <v-simple-table height="300" style="max-width: 440px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Pseudo
              </th>
              <th class="text-left">
                Offres
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="{ username, entryCount } in top" :key="username">
              <td>{{ username }}</td>
              <td>{{ entryCount }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { ApexOptions } from "apexcharts"
import VueApexCharts from "vue-apexcharts"
/* import * as api from "@/api" */
import * as marketData from "@/store/marketData"

export default Vue.extend({
  components: {
    ApexChart: VueApexCharts,
  },
  data() {
    return {
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
        yaxis: [
          {
            show: true,
            min: 42000,
            max: 46000,
          },
          {
            opposite: true,
            show: true,
            min: 4200,
            max: 4600,
          },
        ],
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
  computed: {
    ...marketData.getters,
    series(): ApexAxisChartSeries {
      return [
        {
          name: "Offres",
          data: this.scans.map((row) => ({ x: row.time, y: row.entryCount })),
        },
        {
          name: "Personnages",
          data: this.scans.map((row) => ({ x: row.time, y: row.playerCount })),
        },
      ]
    },
  },
  methods: {},
})
</script>
