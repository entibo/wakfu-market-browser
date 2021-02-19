<template>
  <v-container class="elevation-1">
    <v-row>Graphs and stuff</v-row>
    <v-row>
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
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import * as csv from "@/csv"
import { ItemInfoWithName } from "./ItemSearch.vue"
export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<ItemInfoWithName[]>,
      required: true,
    },
  },
  data: () => ({
    loading: true,
    error: false,
    marketEntriesByItemID: {} as Record<any, any>,
  }),
  computed: {
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
      return result.slice(0,10)
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
