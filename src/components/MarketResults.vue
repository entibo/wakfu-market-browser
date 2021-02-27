<template>
  <div>
    <v-container>
      <v-row>
        <v-subheader>
          {{ $t("results") }}: <strong class="pl-1">{{ tableItems.length }}</strong>
        </v-subheader>
      </v-row>
    </v-container>

    <v-row align="center">
      <v-col>
        <v-text-field
          :value="sellerSearchInput"
          placeholder="Rechercher un vendeur"
          filled
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          clearable
          clear-icon="mdi-backspace"
          @input="(v) => (sellerSearchInput = v ? v : '')"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-data-table :items="tableItems" :headers="headers" soaaart-by="realPrice">
      <template v-slot:item.itemID="{ item: entry }">
        <item :id="entry.itemID" :level="entry.realLevel" dense />
      </template>
      <template v-slot:item.enchantment="{ item: entry }">
        <div v-if="entry.petLVL" class="d-flex flex-column">
          <div class="d-flex align-center">
            <img :src="require('@/assets/hp.png')" width="20" height="20" class="" />
            <div class="">{{ entry.petHP }}</div>
            <div v-if="entry.petName" class="d-flex ml-4 caption">« {{ entry.petName }} »</div>
          </div>
        </div>
        <div v-if="entry.enchantment" class="d-flex align-center">
          <div class="d-flex">
            <div v-for="(slot, index) in entry.enchantment.slots" :key="index">
              <div class="mr-1 mt-1 d-flex flex-column justify-center caption">
                <img
                  :src="
                    require('@/assets/shards/shard_' +
                      slot.color +
                      '_' +
                      (slot.level > 0 ? 'full' : 'empty') +
                      '.png')
                  "
                  width="22"
                  height="22"
                />
                <strong v-if="slot.level > 0" class="text-center grey--text lighten-4">{{
                  slot.level
                }}</strong>
              </div>
            </div>
          </div>
          <template v-if="entry.enchantment.sublimations.length">
            <v-divider vertical inset class="mx-2" />
            <div class="d-flex flex-column">
              <div
                v-for="(sublimationItemID, index) in entry.enchantment.sublimations"
                :key="index"
              >
                <div v-if="sublimationItemID > 0" class="d-flex align-center">
                  <img
                    :src="`https://vertylo.github.io/wakassets/items/${
                      itemInfoMap.get(sublimationItemID).gfxId
                    }.png`"
                    width="20"
                    height="20"
                    class="mr-1"
                  />
                  {{ $t("itemNames." + sublimationItemID) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-slot:item.expirationDate="{ item: entry }">
        {{ dayjs(entry.expirationDate).fromNow(true) }}
      </template>
      <template v-slot:item.realAmount="{ item: entry }">
        <div>{{ entry.realAmount }}</div>
        <div v-if="entry.realStack !== 1" class="caption grey--text lighten-4">
          {{ entry.amount }} x{{ entry.realStack }}
        </div>
      </template>
      <template v-slot:item.realPrice="{ item: entry }">
        <span class="font-weight-medium">
          {{ entry.realPriceWhole
          }}<span class="caption grey--text lighten-4">{{ entry.realPriceDecimals }}</span>
        </span>
        <v-list-item-avatar size class="ma-0">
          <img :src="require('@/assets/k.png')" />
        </v-list-item-avatar>
      </template>
      <!-- <template v-slot:item> (item) </template> -->
    </v-data-table>

    <!-- <v-virtual-scroll bench="10" item-height="40" :items="tableItems" height="400">
      <template v-slot:default="{ item: entry }">
        <item :id="entry.itemID" :level="entry.realLevel" dense />
      </template>
    </v-virtual-scroll> -->
  </div>
</template>

<script lang="ts">
import Item from "@/components/Item.vue"
import { itemInfoMap } from "@/data/items"
import * as marketData from "@/store/marketData"
import { MarketEntry } from "@/store/marketData"
import dayjs from "dayjs"
import Vue, { PropType } from "vue"
import type { DataTableHeader } from "vuetify"

function extraSortScore(enchantment: MarketEntry["enchantment"]): number {
  if (!enchantment) return -1
  let score = 0
  score += 1000 * enchantment.sublimations.length
  score += enchantment.slots.length * 100
  for (const slot of enchantment.slots) {
    if (slot.color === "white") score += 10
    score += slot.level
  }
  return score
}

export default Vue.extend({
  components: {
    Item,
  },
  props: {
    items: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  data() {
    return {
      itemInfoMap,
      simplifyAmount: true,
      sellerSearchInput: "",
      dayjs,
    }
  },
  computed: {
    ...marketData.getters,
    headers(): DataTableHeader[] {
      const item: DataTableHeader = {
        text: "",
        value: "itemID",
        sort: (a, b) => a - b,
        width: 350,
        divider: true,
      }
      const extra: DataTableHeader = {
        text: "",
        sort: (a, b) => extraSortScore(a) - extraSortScore(b),
        value: "enchantment",
      }
      const username: DataTableHeader = {
        text: this.$t("seller") as string,
        value: "username",
        sort: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
        align: "center",
      }
      const expirationDate: DataTableHeader = {
        text: this.$t("timeLeft") as string,
        value: "expirationDate",
        sort: (a, b) => a - b,
        align: "center",
        cellClass: ["text-no-wrap"],
      }
      const amount: DataTableHeader = {
        text: this.$t("amount") as string,
        value: "realAmount",
        sort: (a, b) => a - b,
        align: "center",
      }
      const price: DataTableHeader = {
        text: this.$t("price") as string,
        value: "realPrice",
        sort: (a, b) => a - b,
        align: "center",
        cellClass: ["text-no-wrap text-end"],
      }

      return [item, extra, username, expirationDate, amount, price]
    },
    selectedCurrentMarketEntries(): readonly MarketEntry[] {
      console.log("computing selectedCurrentMarketEntries")

      //return this.currentMarketEntries
      if (!this.items.length) {
        return this.currentMarketEntries
      }
      const list = [] as MarketEntry[]
      for (const id of this.items) {
        const entries = this.currentMarketEntriesById[id]
        if (!entries) continue
        //list = list.concat(entries)
        for (const entry of entries) list.push(entry)
      }
      return Object.freeze(list)
    },
    activeCurrentMarketEntries(): readonly MarketEntry[] {
      const now = Date.now()
      return Object.freeze(
        this.selectedCurrentMarketEntries.filter((entry) => entry.expirationDate > now),
      )
    },
    filteredEntries(): readonly MarketEntry[] {
      console.log("computing filteredEntries")
      console.log("activeCurrentMarketEntries", this.activeCurrentMarketEntries)
      let entries = this.activeCurrentMarketEntries
      if (this.sellerSearchInput !== "") {
        entries = entries.filter((entry) => entry.username.includes(this.sellerSearchInput))
      }
      return Object.freeze(entries)
    },
    tableItems(): readonly MarketEntry[] {
      console.log("computing tableItems")
      const tableItems = this.filteredEntries
      console.log("tableItems:", tableItems)
      return tableItems
    },
  },
  methods: {
    ...marketData.actions,
  },
})
</script>
