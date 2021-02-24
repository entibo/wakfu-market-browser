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
      <template v-slot:item.itemID="{ item }">
        <item :id="item.itemID" :level="item.realLevel" dense />
      </template>
      <template v-slot:item.extra="{ item }">
        <div v-if="item.petLVL" class="d-flex flex-column">
          <div class="d-flex align-center">
            <img :src="require('@/assets/hp.png')" width="20" height="20" class="" />
            <div class="">{{ item.petHP }}</div>
            <div v-if="item.petName" class="d-flex ml-4 caption">« {{ item.petName }} »</div>
          </div>
        </div>
        <div v-if="item.enchantment" class="d-flex align-center">
          <div class="d-flex">
            <div v-for="(slot, index) in item.enchantment.slots" :key="index">
              <div class="mr-1">
                <v-badge
                  :value="slot.level > 0"
                  bordered
                  bottom
                  color="primary"
                  :content="slot.level"
                  overlap
                  transition=""
                >
                  <img
                    :src="
                      require('@/assets/shards/shard_' +
                        slot.color +
                        '_' +
                        (slot.level > 0 ? 'full' : 'empty') +
                        '.png')
                    "
                    width="25"
                    height="25"
                  />
                </v-badge>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div v-for="(sublimationItemID, index) in item.enchantment.sublimations" :key="index">
              <div v-if="sublimationItemID > 0" class="d-flex align-center ml-4">
                <img
                  :src="
                    `https://vertylo.github.io/wakassets/items/${
                      itemInfoMap.get(sublimationItemID).gfxId
                    }.png`
                  "
                  width="20"
                  height="20"
                  class="mr-1"
                />
                {{ $t("itemNames." + sublimationItemID) }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:item.expirationDate="{ item }">
        {{ dayjs(item.expirationDate).fromNow(true) }}
      </template>
      <template v-slot:item.realAmount="{ item }">
        <div>{{ item.realAmount }}</div>
        <div v-if="item.realStack !== 1" class="caption grey--text lighten-4">
          {{ item.amount }} x{{ item.realStack }}
        </div>
      </template>
      <template v-slot:item.realPrice="{ item }">
        <span class="font-weight-medium">
          {{ item.realPriceWhole
          }}<span class="caption grey--text lighten-4">{{ item.realPriceDecimals }}</span>
        </span>
        <v-list-item-avatar size class="ma-0">
          <img :src="require('@/assets/k.png')" />
        </v-list-item-avatar>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import * as marketData from "@/store/marketData"
import { MarketEntry } from "@/store/marketData"
import Vue, { PropType } from "vue"
import { ItemInfoWithName } from "./ItemSearch.vue"
import Item from "./Item.vue"
import dayjs from "dayjs"
import { itemInfoMap } from "@/data/items"

import type { DataTableHeader } from "vuetify"

export default Vue.extend({
  components: {
    Item,
  },
  props: {
    items: {
      type: Array as PropType<ItemInfoWithName[]>,
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
        sortable: false,
        value: "itemID",
        width: 350,
        divider: true,
      }
      const extra: DataTableHeader = {
        text: "",
        sortable: false,
        value: "extra",
      }
      const username: DataTableHeader = {
        text: this.$t("seller") as string,
        value: "username",
        align: "center",
      }
      const expirationDate: DataTableHeader = {
        text: this.$t("timeLeft") as string,
        value: "expirationDate",
        align: "center",
        cellClass: ["text-no-wrap"],
      }
      const amount: DataTableHeader = {
        text: this.$t("amount") as string,
        value: "realAmount",
        align: "center",
      }
      const price: DataTableHeader = {
        text: this.$t("price") as string,
        value: "realPrice",
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
      for (const { id } of this.items) {
        const entries = this.currentMarketEntriesById[id]
        if (!entries) continue
        //list = list.concat(entries)
        for (const entry of entries) list.push(entry)
      }
      return Object.freeze(list)
    },
    activeCurrentMarketEntries(): readonly MarketEntry[] {
      const now = Date.now()
      return Object.freeze(this.selectedCurrentMarketEntries.filter((entry) => entry.expirationDate > now))
    },
    filteredEntries(): readonly MarketEntry[] {
      console.log("computing filteredEntries")
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
      return Object.freeze(tableItems)
    },
  },
  methods: {
    ...marketData.actions,
  },
})
</script>
