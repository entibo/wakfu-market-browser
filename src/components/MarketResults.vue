<template>
  <div>
    {{ selectedCurrentMarketEntries.length }}

    <v-data-table :items="tableItems" :headers="headers">
      <template v-slot:item.itemID="{ item }">
        <item :id="item.itemID" :level="item.realLevel" :width="350" dense />
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

import type { DataTableHeader } from "vuetify"

console.log("marketData", marketData)

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
      simplifyAmount: true,
    }
  },
  computed: {
    ...marketData.getters,
    headers(): DataTableHeader[] {
      const item: DataTableHeader = {
        text: "",
        sortable: false,
        value: "itemID",
      }
      const extra: DataTableHeader = {
        text: "",
        sortable: false,
        value: "",
        divider: true,
      }
      const username: DataTableHeader = {
        text: this.$t("seller") as string,
        value: "username",
        align: "center",
      }
      const timeLeft: DataTableHeader = {
        text: this.$t("timeLeft") as string,
        value: "",
        align: "center",
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

      return [item, extra, username, timeLeft, amount, price]
    },
    selectedCurrentMarketEntries(): MarketEntry[] {
      console.log("computing selectedCurrentMarketEntries")
      let list = [] as MarketEntry[]
      for (const { id } of this.items) {
        const entries = this.currentMarketEntriesById.get(id)
        if (!entries) continue
        list = list.concat(entries)
      }
      return list
    },
    tableItems(): MarketEntry[] {
      const entries = this.selectedCurrentMarketEntries
      return entries.map((entry) => {
        const realLevel = entry.petLVL ?? entry.makaLVL ?? undefined
        const realStack = [0, 1, 10, 50, 100][entry.stack]
        const realAmount = entry.amount * realStack
        const realPrice = entry.price / realStack
        const [realPriceWhole, _realPriceDecimals] = realPrice.toString().split(".")
        return {
          ...entry,
          realLevel,
          realStack,
          realAmount,
          realPrice,
          realPriceWhole: this.formatPrice(realPriceWhole),
          realPriceDecimals: _realPriceDecimals ? "." + _realPriceDecimals : "",
        }
      })
    },
  },
  methods: {
    ...marketData.actions,
    formatPrice(x: number | string) {
      const [whole, decimals] = x.toString().split(".")
      const digits = [...whole].reverse()
      const result = []
      for (let i = 0; i < digits.length; i++) {
        result.push(digits[i])
        if (i < digits.length - 1 && (i + 1) % 3 === 0) result.push(" ")
      }
      return result.reverse().join("") + (decimals ? "." + decimals : "")
    },
  },
})
</script>
