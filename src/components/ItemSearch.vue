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

        <v-progress-linear :active="loading" color="primary" indeterminate />

        <v-container class="mt-2">
          <v-row>
            <v-subheader>
              {{ $t("results") }}: <strong class="pl-1">{{ items.length }}</strong>
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
            <v-virtual-scroll bench="10" :items="items" height="400" item-height="59">
              <template v-slot:default="{ item: id }">
                <v-list-item :key="id" :value="id" color="primary">
                  <item :id="id" show-favorite />
                </v-list-item>
                <v-divider />
              </template>
            </v-virtual-scroll>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col><market :items="marketItems"></market></v-col>
  </v-row>
</template>

<script lang="ts">
import Item from "@/components/Item.vue"
import ItemSearchFilters, { defaultItemSearchFilters } from "@/components/ItemSearchFilters.vue"
import Market from "@/components/Market.vue"
import { encyclopediaItemList, ItemInfo } from "@/data/items"
import { defaultSortBy, ItemQuery } from "@/worker/my.worker"
import worker from "@/worker/wrapper"
import Vue from "vue"
import { mapGetters } from "vuex"

export interface ItemInfoWithName extends ItemInfo {
  name: string
}

export default Vue.extend({
  components: {
    Item,
    Market,
    ItemSearchFilters,
  },
  props: {},
  data: function () {
    return {
      tab: 1,
      searchInput: "",
      showFilters: false,
      itemSearchFilters: defaultItemSearchFilters(),
      sortBy: defaultSortBy(),
      queryItems: [] as number[],
      loading: false,
      selectedItem: null as number | null,
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
    query(): ItemQuery {
      return {
        locale: this.$i18n.locale,
        name: this.searchInput,
        ...this.itemSearchFilters,
        sortBy: this.sortBy,
      }
    },
    tabItems(): number[] {
      return this.tab === 1 ? this.queryItems : this.queryItems.filter((id) => this.isFavorite(id))
    },
    items(): number[] {
      console.log("items:", this.tabItems)
      return this.tabItems
    },

    marketItems(): number[] {
      if (this.selectedItem) return [this.selectedItem]
      if (this.items.length === encyclopediaItemList.length) return []
      return this.items
    },
  },
  watch: {
    query() {
      this.runQuery()
    },
    searchResultItems() {
      this.selectedItem = null
    },
  },
  created() {
    this.runQuery()
  },
  methods: {
    async runQuery() {
      this.loading = true
      const queryResult = await worker.queryEncyclopedia(this.query)
      this.loading = false
      this.queryItems = queryResult
      console.log("query", this.query, queryResult)
    },
    resetSort() {
      this.sortBy = {
        value: null,
        descending: true,
      }
    },
    sortChipClick(value: string) {
      this.sortBy =
        this.sortBy.value === value
          ? this.sortBy.descending
            ? { value, descending: false }
            : defaultSortBy()
          : { value, descending: true }
    },
  },
})
</script>
