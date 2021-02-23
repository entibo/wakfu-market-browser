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

    <v-data-table :items="tableItems" :headers="headers" sort-by="realPrice">
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
        <div v-if="item.subSlot1Type" class="d-flex align-center">
          <div class="d-flex">
            <div v-for="slot in [1, 2, 3, 4]" :key="slot">
              <div v-if="item['subSlot' + slot + 'Type']" class="mr-1">
                <v-badge
                  :value="item['subSlot' + slot + 'LVL'] > 0"
                  bordered
                  bottom
                  color="primary"
                  :content="subSlotLevel(item['subSlot' + slot + 'LVL'])"
                  overlap
                  transition=""
                >
                  <img
                    :src="
                      require('@/assets/shards/shard_' +
                        ['none', 'red', 'green', 'blue', 'white'][item['subSlot' + slot + 'Type']] +
                        '_' +
                        (item['subSlot' + slot + 'LVL'] > 0 ? 'full' : 'empty') +
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
            <div v-for="slot in [1, 2]" :key="slot">
              <div v-if="item['subSub' + slot]" class="d-flex align-center ml-4">
                <img
                  :src="`https://vertylo.github.io/wakassets/items/${
                    itemInfo.get(item['subSub' + slot]).gfxId
                  }.png`"
                  width="20"
                  height="20"
                  class="mr-1"
                />
                {{ $t("itemNames." + item["subSub" + slot]) }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:item.timeLeft="{ item }">
        {{ item.expirationDateString }}
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
import { itemInfo } from "@/data/items"

import type { DataTableHeader } from "vuetify"

export function formatPrice(x: number | string) {
  const [whole, decimals] = x.toString().split(".")
  const digits = [...whole].reverse()
  const result = []
  for (let i = 0; i < digits.length; i++) {
    result.push(digits[i])
    if (i < digits.length - 1 && (i + 1) % 3 === 0) result.push(" ")
  }
  return result.reverse().join("") + (decimals ? "." + decimals : "")
}

export function subSlotLevel(x: number) {
  const table = {
    0: 0,
    1: 1,
    3: 2,
    7: 3,
    15: 4,
    31: 5,
    63: 6,
    127: 7,
    319: 8,
    895: 9,
    3199: 10,
  }
  return table[x as keyof typeof table] ?? 0
}

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
      itemInfo,
      simplifyAmount: true,
      sellerSearchInput: "",
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
      const timeLeft: DataTableHeader = {
        text: this.$t("timeLeft") as string,
        value: "timeLeft",
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
    sortedEntries(): MarketEntry[] {
      let entries = this.selectedCurrentMarketEntries
      if(this.sellerSearchInput !== "") {
        entries = entries.filter(entry => entry.username.includes(this.sellerSearchInput))
      }
      return entries
    },
    tableItems(): MarketEntry[] {
      const entries = this.sortedEntries
      return entries.map((entry) => {
        const realLevel = entry.petLVL ?? entry.makaLVL ?? undefined
        const realStack = [0, 1, 10, 50, 100][entry.stack]
        const realAmount = entry.amount * realStack
        const realPrice = entry.price / realStack
        const [realPriceWhole, _realPriceDecimals] = realPrice.toString().split(".")
        const durationDays = [0, 7, 14, 28][entry.duration]
        const durationHours = durationDays * 24 - 1
        const expirationDate = dayjs(entry.added).add(durationHours, "hours")
        const expirationDateString = expirationDate.fromNow(true)
        return {
          ...entry,
          realLevel,
          realStack,
          realAmount,
          realPrice,
          realPriceWhole: formatPrice(realPriceWhole),
          realPriceDecimals: _realPriceDecimals ? "." + _realPriceDecimals : "",
          timeLeft: Date.now() - expirationDate.valueOf(),
          expirationDateString,
        }
      })
    },
  },
  methods: {
    ...marketData.actions,
    subSlotLevel,
  },
})
</script>
