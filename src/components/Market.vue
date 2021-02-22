<template>
  <v-card outlined>
    <v-app-bar flat dense>
      <v-tabs v-model="tab" :icons-and-text="false">
        <v-tab>
          <v-icon class="mr-1">mdi-home</v-icon>
          Aperçu
        </v-tab>
        <v-tab>
          <v-icon class="mr-1">mdi-view-list</v-icon>
          Liste
        </v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn
        icon
        :input-value="showFilters"
        tile
        :color="isDefaultFilters ? '' : 'primary'"
        class="mr-n4"
        @click="showFilters = !showFilters"
      >
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </v-app-bar>

    <v-expand-transition>
      <div v-if="showFilters"></div>
    </v-expand-transition>

    <market-overview v-if="tab === 0" />
    <market-results v-else-if="tab === 1" :items="items"/>

    <!-- <v-row align="center">
      <v-list>
        <v-list-item v-for="(f, index) in foo" :key="index">
          <v-list-item-avatar size="42" rounded>
            <v-img
              class="item-image"
              :src="`https://vertylo.github.io/wakassets/items/${f.gfxId}.png`"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ f.itemID }} {{ f.username }} {{ f.price }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row> -->
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import * as csv from "@/csv"
import { ItemInfoWithName } from "./ItemSearch.vue"
import MarketOverview from "./MarketOverview.vue"
import MarketResults from "./MarketResults.vue"
export default Vue.extend({
  components: {
    MarketOverview,
    MarketResults,
  },
  props: {
    items: {
      type: Array as PropType<ItemInfoWithName[]>,
      required: true,
    },
  },
  data: () => ({
    tab: 1,
    showFilters: false,
    loading: true,
    error: false,
    marketEntriesByItemID: {} as Record<any, any>,
  }),
  computed: {
    isDefaultFilters(): boolean {
      return true
    },
    foo(): any[] {
      console.log("computing foo")
      const result = []
      for (const item of this.items) {
        const marketEntries = this.marketEntriesByItemID[item.id]
        if (!marketEntries) continue
        for (const entry of marketEntries) {
          result.push(entry)
        }
      }
      console.log("computed foo; length=", result.length)
      return result.slice(0, 10)
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      console.log("fetchData")
      const marketEntries = await fetch(
        "https://entibo.github.io/wakfu-market-data/pandora/current.csv",
      )
        .then((resp) => resp.text())
        .then(csv.decode)
      console.log("Data fetched!")
      this.marketEntriesByItemID = {} as Record<any, any>
      for (const entry of marketEntries) {
        let list = this.marketEntriesByItemID[entry.itemID]
        if (!list) this.marketEntriesByItemID[entry.itemID] = list = []
        list.push(entry)
      }
    },
  },
})
</script>
