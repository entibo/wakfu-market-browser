<style lang="scss" scoped>
.item-border {
  border-width: 3px;
  border-style: ridge;
  border-radius: 4px;
  //padding: 2px;
  position: relative;
  width: 46px;
  height: 46px;
  margin: 8px;
  background: none;
}
</style>

<template>
  <v-row>
    <v-col style="max-width: 600px">
      <v-card outlined>
        <v-app-bar flat dense>
          <v-tabs v-model="tab" :icons-and-text="false">
            <v-tab>
              <v-icon class="mr-1">mdi-star</v-icon>
              Favoris
            </v-tab>
            <v-tab>
              <v-icon class="mr-1">mdi-database</v-icon>
              Encyclopédie
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
          <div v-if="showFilters">
            <item-search-filters v-model="itemSearchFilters" />
          </div>
        </v-expand-transition>

        <v-row align="center">
          <v-col>
            <v-text-field
              :value="searchInput"
              placeholder="Rechercher un object"
              filled
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              clearable
              clear-icon="mdi-backspace"
              @input="(v) => (searchInput = v ? v : '')"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-container class="mt-2">
          <v-row>
            <v-subheader>
              {{ $t("results") }}: <strong class="pl-1">{{ sortedItems.length }}</strong>
            </v-subheader>
            <v-spacer />
            <div class="d-flex flex-nowrap pl-4">
              <v-icon class="mr-3">mdi-sort-variant</v-icon>
              <v-chip-group>
                <v-chip
                  v-for="value in ['name', 'type', 'rarity', 'level']"
                  :key="value"
                  :input-value="sortBy.value === value"
                  @click="sortChipClick(value)"
                >
                  {{ $t(value) }}
                  <v-slide-x-transition hide-on-leave>
                    <v-icon v-if="sortBy.value === value && sortBy.descending"
                      >mdi-arrow-down</v-icon
                    >
                    <v-icon v-else-if="sortBy.value === value && !sortBy.descending"
                      >mdi-arrow-up</v-icon
                    >
                  </v-slide-x-transition>
                </v-chip>
              </v-chip-group>
            </div>
          </v-row>
        </v-container>

        <v-list>
          <v-list-item-group v-model="selectedItem">
            <v-virtual-scroll bench="10" :items="sortedItems" height="400" item-height="59">
              <template v-slot:default="{ item }">
                <v-list-item
                  :key="item.id"
                  :value="item"
                  :class="`raerity-${item.rarity}`"
                  color="primary"
                >
                  <item :item="item" show-favorite />
                </v-list-item>
                <v-divider />
              </template>
            </v-virtual-scroll>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col><market :items="selectedItem ? [selectedItem] : sortedItems"></market></v-col>
  </v-row>
</template>

<script lang="ts">
import { parentCategory } from "@/data/item-category"
import { itemInfo, ItemInfo } from "@/data/items"
import Fuse from "fuse.js"
import latinize from "latinize"
import Vue from "vue"
import Market from "./Market.vue"
import Item from "./Item.vue"
import ItemSearchFilters, { defaultItemSearchFilters } from "./ItemSearchFilters.vue"
import { mapGetters, mapMutations } from "vuex"

export interface ItemInfoWithName extends ItemInfo {
  name: string
  nameNormalized: string
}
export function normalize(str: string) {
  str = latinize(str)
  str = str.replace(/[-°/]/g, " ")
  str = str.replace(/[()"'!?’‘.,«»:]/g, "")
  str = str.replace(/ {2}/g, " ")
  return str
}

export default Vue.extend({
  components: {
    Item,
    Market,
    ItemSearchFilters,
  },
  props: {},
  data: function() {
    return {
      tab: 1,
      searchInput: "",
      itemSearchFilters: defaultItemSearchFilters(),
      showFilters: false,
      sortBy: {
        value: null as null | string,
        descending: true,
      },
      selectedItem: null,
    }
  },
  computed: {
    ...mapGetters("favorites", {
      isFavorite: "has",
    }),
    isDefaultFilters(): boolean {
      return (
        this.itemSearchFilters.level[0] === 0 &&
        this.itemSearchFilters.level[1] === 215 &&
        this.itemSearchFilters.categories.length === 0 &&
        this.itemSearchFilters.rarities.length === 0
      )
    },
    allItems(): ItemInfoWithName[] {
      const all = Object.entries(this.$i18n.messages[this.$i18n.locale].itemNames).map(
        ([id, name]) => ({
          name: name as string,
          nameNormalized: normalize(name),
          ...itemInfo.get(parseInt(id))!,
        }),
      )
      const list = this.tab === 1 ? all : all.filter((x) => this.isFavorite(x.id))
      console.log(list)
      return list
    },
    localizedItems(): ItemInfoWithName[] {
      /* return Object.entries(this.$i18n.messages[this.$i18n.locale].itemNames).map(([id, name]) => ({
        name: name as string,
        nameNormalized: normalize(name),
        ...itemInfo.get(parseInt(id))!,
      })) */
      return this.allItems
    },
    filteredItems(): ItemInfoWithName[] {
      return this.localizedItems.filter((item) => {
        const categoryOk = this.itemSearchFilters.categories.length
          ? this.itemSearchFilters.categories.includes(item.type)
          : true
        const rarityOk = this.itemSearchFilters.rarities.length
          ? this.itemSearchFilters.rarities.includes(item.rarity)
          : true
        return (
          categoryOk &&
          rarityOk &&
          item.level >= this.itemSearchFilters.level[0] &&
          item.level <= this.itemSearchFilters.level[1]
        )
      })
    },
    fuse(): Fuse<ItemInfoWithName> {
      return new Fuse(this.filteredItems, {
        keys: ["nameNormalized"],
        threshold: 0.1,
        isCaseSensitive: false,
        useExtendedSearch: false,
        ignoreLocation: true,
      })
    },
    searchResultItems(): ItemInfoWithName[] {
      if (this.searchInput === "") {
        return this.filteredItems
      } else if (this.searchInput.match(/^\d+$/)) {
        const itemID = parseInt(this.searchInput)
        return this.allItems.filter((x) => x.id === itemID)
      }
      console.log("searchInput:", this.searchInput)
      const pattern = normalize(this.searchInput)
      const result = this.fuse.search(pattern)
      return result.map((x) => x.item)
    },
    sortedItems(): ItemInfoWithName[] {
      const sortFn =
        this.sortBy.value === "name"
          ? (a: { name: string }, b: { name: string }) =>
              b.name.toLowerCase().localeCompare(a.name.toLowerCase())
          : this.sortBy.value === "type"
          ? (a: { type: number }, b: { type: number }) => a.type - b.type
          : this.sortBy.value === "rarity"
          ? (a: { rarity: number }, b: { rarity: number }) => a.rarity - b.rarity
          : this.sortBy.value === "level"
          ? (a: { level: number }, b: { level: number }) => a.level - b.level
          : null

      if (sortFn === null) {
        return this.searchResultItems
      }
      let sortedItems = [...this.searchResultItems].sort(sortFn)
      if (this.sortBy.descending) {
        sortedItems = sortedItems.reverse()
      }
      return sortedItems
    },
  },
  watch: {
    searchResultItems() {
      this.selectedItem = null
    },
    sortedItems() {
      ;(window as any).sortedItems = this.sortedItems
    },
  },
  methods: {
    resetSort() {
      this.sortBy = {
        value: null,
        descending: true,
      }
    },
    sortChipClick(value: string) {
      if (this.sortBy.value === value) {
        if (this.sortBy.descending) {
          this.sortBy.descending = false
        } else {
          this.resetSort()
        }
      } else {
        this.resetSort()
        this.sortBy.value = value
      }
    },
  },
})
</script>
