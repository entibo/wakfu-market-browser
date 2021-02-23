<template>
  <div>
    <apex-chart type="line" height="350" :series="series" :options="chartOptions" />
    <div class="d-flex">
      <v-container>
        <v-simple-table height="300" style="max-width: 440px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Pseudo</th>
                <th class="text-left">Offres</th>
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

      <v-container v-if="spa !== null">
        <v-card max-width="350">
          <v-card-title>
            <img :src="require('@/assets/item-category/582.png')" class="mr-4" />
            Adoptez moi !
            <v-spacer />
            <v-btn tile color="" icon @click="getRandomPet">
              <v-icon>mdi-replay</v-icon>
            </v-btn>
          </v-card-title>
          <v-container class="d-flex align-center pt-0">
            <div class="d-flex flex-column justify-center pa-2">
              <img
                width="64"
                height="64"
                :src="`https://vertylo.github.io/wakassets/items/${spa.gfxId}.png`"
              />
              <div class="d-flex justify-center mt-2">
                <img :src="require('@/assets/hp.png')" width="25" height="25" class="mr-1" />
                <div class="">{{ spa.petHP }}</div>
              </div>
            </div>

            <div class="ml-2">
              <div>
                <span class="subtitle-2">{{ $t("name") }}: </span>
                <span class="subtitle-1">{{ spa.petName }}</span>
              </div>
              <div>
                <span class="subtitle-2">{{ $t("race") }}: </span>
                <span class="overline">{{ spa.name }}</span>
              </div>
              <div>
                <span class="subtitle-2">{{ $t("level-abbreviated") }}: </span>
                <span class="body-2">{{ spa.petLVL }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="subtitle-2">{{ $t("price") }}: </span>
                <span class="body-2 ml-1">{{ formatPrice(spa.price) }}</span>
                <img :src="require('@/assets/k.png')" />
              </div>
            </div>
          </v-container>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { ApexOptions } from "apexcharts"
import VueApexCharts from "vue-apexcharts"
/* import * as api from "@/api" */
import * as marketData from "@/store/marketData"
import { ItemInfo, itemInfo } from "@/data/items"
import { ItemInfoWithName } from "./ItemSearch.vue"

import { formatPrice } from "@/components/MarketResults.vue"

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
      spa: null as any,
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
  mounted() {
    this.getRandomPet()
  },
  methods: {
    formatPrice,
    getRandomPet() {
      const list = this.currentMarketEntries.filter((entry) => entry.petName)
      const pet = list[(Math.random() * list.length) | 0]
      if (!pet) return null
      this.spa = {
        ...pet,
        ...itemInfo.get(pet.itemID),
        name: this.$t("itemNames." + pet.itemID) as string,
      }
    },
  },
})
</script>
