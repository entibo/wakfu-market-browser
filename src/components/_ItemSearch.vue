<template>
  <v-container class="elevation-1">
    <v-toolbar dense>
      <v-app-bar-nav-icon @click="advancedSearch = !advancedSearch">
        <v-icon>mdi-filter</v-icon>
      </v-app-bar-nav-icon>
      <v-text-field
        v-model="search"
        single-line
        full-width
        @input="doSearch(search)"
      ></v-text-field>
      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="advancedSearch">
      Advanced !
    </v-navigation-drawer>

    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.name="{ item }">
        <v-row align="center">
          <v-img
            max-width="40"
            max-height="40"
            :src="`https://vertylo.github.io/wakassets/items/${item.gfxId}.png`"
          ></v-img>
          <div class="text-subtitle-2">
            {{ item.name }}
          </div>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { getItemInfo } from "@/data/items"
import Fuse from "fuse.js"
import latinize from "latinize"
import Vue from "vue"
import WakfuItem from "./WakfuItem.vue"
export default Vue.extend({
  props: {},
  data: function() {
    return {
      search: "",
      advancedSearch: false,
      headers: [
        {
          text: this.$i18n.t("level"),
          value: "level",
        },
        {
          text: this.$i18n.t("rarity"),
          value: "rarity",
        },
        {
          text: this.$i18n.t("name"),
          value: "name",
        },
        {
          text: this.$i18n.t("type"),
          value: "type",
        },
      ],
      items: [] as any[],
    }
  },
  computed: {
    fuse() {
      const items = Object.entries(
        this.$i18n.messages[this.$i18n.locale].itemNames,
      ).map(([id, name]) => ({ id: parseInt(id), name, nameLatinized: latinize(name) }))
      console.log("making a fuse")
      ;(window as any).items = items
      return new Fuse(items, {
        keys: ["nameLatinized"],
        threshold: 0.1,
        isCaseSensitive: false,
        useExtendedSearch: false,
      })
    },
  },
  methods: {
    doSearch(search: string) {
      search = latinize(search)
      const results = this.fuse.search(search)
      this.items = results.map(({ item }) => ({ name: item.name, ...getItemInfo(item.id)! }))
    },
  },
  components: {
    WakfuItem,
  }
})
</script>
