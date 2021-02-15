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
}
.inventory-grid {
  td {
    //background: greenyellow;
    width: 48px;
    height: 48px;
  }
}
</style>

<template>
  <v-container class="elevation-1">
    <v-row align="center">
      <v-btn icon @click="showFilters = !showFilters">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
      <v-text-field
        v-model="searchFilters.search"
        single-line
        placeholder="Rechercher un object"
      ></v-text-field>
      <v-btn icon @click="resetSearch">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>

    <v-slide-y-transition>
      <v-container v-if="showFilters" class="mb-2">
        <v-row align="center">
          <v-range-slider
            v-model="searchFilters.level"
            :label="$t('level')"
            step="1"
            min="0"
            max="215"
            thumb-label="always"
          >
          </v-range-slider>
        </v-row>
        <v-row align="center">
          <span
            :class="['v-label', 'mr-3', $vuetify.theme.dark ? 'theme--dark' : 'theme--light']"
            v-text="$t('rarity')"
          />
          <v-chip-group v-model="searchFilters.rarities" multiple>
            <v-chip
              v-for="rarity in [1, 2, 3, 4, 5, 6, 7]"
              :key="rarity"
              :value="rarity"
              :active-class="'rarity-' + rarity"
            >
              <img :src="require('@/assets/rarity/' + rarity + '.png')" />
            </v-chip>
          </v-chip-group>
          <v-chip
            outlined
            @click="searchFilters.rarities = []"
            v-text="$t('all')"
            color="secondary"
          />
        </v-row>
        <v-row>
          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Dropdown
              </v-btn>
            </template>

            <v-card>
              <v-subheader>Inventaire</v-subheader>
              <v-container>
                <table class="inventory-grid">
                  <tr>
                    <td>
                      <v-list-item @click="()=>0" color="primary" :input-value="false" class="elevation-1">
                        <img :src="require('@/assets/item-category/'+category.hat+'.png')" />
                      </v-list-item>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>.</td>
                  </tr>
                  <tr>
                    <td>.</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>.</td>
                  </tr>
                  <tr>
                    <td>.</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>.</td>
                  </tr>
                  <tr>
                    <td>.</td>
                    <td></td>
                    <td>.</td>
                    <td>.</td>
                    <td></td>
                    <td>.</td>
                  </tr>
                  <tr>
                    <td>.</td>
                    <td>.</td>
                    <td>.</td>
                    <td>.</td>
                    <td></td>
                  </tr>
                </table>
              </v-container>
            </v-card>
          </v-menu>
        </v-row>
      </v-container>
    </v-slide-y-transition>

    <v-container>
      <v-row>
        <v-subheader>{{ $t("results") }}: {{ items.length }}</v-subheader>
        <v-spacer />
        <v-icon class="mr-3">mdi-sort-variant</v-icon>
        <v-chip-group>
          <v-chip
            v-for="value in ['type', 'rarity', 'level']"
            :key="value"
            :input-value="sortBy.value === value"
            @click="sortChipClick(value)"
          >
            {{ $t(value) }}
            <v-slide-x-transition hide-on-leave>
              <v-icon v-if="sortBy.value === value && sortBy.descending">mdi-arrow-down</v-icon>
              <v-icon v-else-if="sortBy.value === value && !sortBy.descending">mdi-arrow-up</v-icon>
            </v-slide-x-transition>
          </v-chip>
        </v-chip-group>
      </v-row>
    </v-container>

    <v-list>
      <v-list-item-group>
        <v-virtual-scroll bench="10" :items="items" height="400" item-height="60">
          <template v-slot:default="{ item }">
            <v-list-item :key="item.id" :class="`rarity-${item.rarity}`">
              <v-list-item-avatar size="42" rounded>
                <v-img
                  class="item-image"
                  :src="`https://vertylo.github.io/wakassets/items/${item.gfxId}.png`"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { getItemInfo } from "@/data/items"
import Fuse from "fuse.js"
import latinize from "latinize"
import Vue from "vue"

interface SearchFilters {
  search: string
  level: [number, number]
  types: number[]
  rarities: number[]
}
const defaultSearchFilters: () => SearchFilters = () => ({
  search: "",
  level: [0, 215],
  types: [],
  rarities: [],
})

export default Vue.extend({
  components: {
    //WakfuItem,
  },
  props: {},
  data: function() {
    return {
      searchFilters: defaultSearchFilters(),
      showFilters: true,
      sortBy: {
        value: null as string | null,
        descending: true,
      },
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
    }
  },
  computed: {
    localizedItems() {
      return Object.entries(this.$i18n.messages[this.$i18n.locale].itemNames).map(([id, name]) => ({
        id: parseInt(id),
        name: name as string,
        nameLatinized: latinize(name),
        ...getItemInfo(parseInt(id))!,
      }))
    },
    filteredItems() {
      return this.localizedItems.filter((item) => {
        const categoryOk = this.searchFilters.types.length
          ? this.searchFilters.types.includes(item.type)
          : true
        const rarityOk = this.searchFilters.rarities.length
          ? this.searchFilters.rarities.includes(item.rarity)
          : true
        return (
          categoryOk &&
          rarityOk &&
          item.level >= this.searchFilters.level[0] &&
          item.level <= this.searchFilters.level[1]
        )
      })
    },
    fuse() {
      console.log("making a fuse")
      ;(window as any).filteredItems = this.filteredItems
      return new Fuse(this.filteredItems, {
        keys: ["nameLatinized"],
        threshold: 0.1,
        isCaseSensitive: false,
        useExtendedSearch: false,
        ignoreLocation: true,
      })
    },
    searchResults() {
      if (this.searchFilters.search === "") {
        return this.filteredItems
      }
      const pattern = latinize(this.searchFilters.search)
      const items = this.fuse.search(pattern)
      return items.map((x) => x.item)
    },
    items() {
      const sortFn =
        this.sortBy.value === "type"
          ? (a, b) => a.type - b.type
          : this.sortBy.value === "rarity"
          ? (a, b) => a.rarity - b.rarity
          : this.sortBy.value === "level"
          ? (a, b) => a.level - b.level
          : null

      if (sortFn === null) {
        return this.searchResults
      }
      let sortedItems = [...this.searchResults].sort(sortFn)
      if (this.sortBy.descending) {
        sortedItems = sortedItems.reverse()
      }
      console.log(sortedItems)
      return sortedItems
    },
  },
  methods: {
    /* doSearch(search: string) {
      search = latinize(search)
      const results = this.fuse.search(search)
      this.items = results.map(({ item }) => ({ ...item, ...getItemInfo(item.id)! }))
      console.log(this.items)
    }, */
    resetSearch() {
      this.searchFilters = defaultSearchFilters()
    },
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
    rarityColor(rarity: number) {
      return [
        "",
        "",
        "green lighten-5", //"light-green accent-1",
        "orange lighten-5",
        "yellow lighten-5",
        "pink lighten-5",
        "light-blue lighten-5",
        "purple lighten-5",
      ][rarity]
    },
  },
})
</script>
