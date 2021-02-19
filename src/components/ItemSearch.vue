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
    width: 40px;
    height: 40px;
  }
}
</style>

<template>
  <v-row>
    <v-col>
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
                color="secondary"
                @click="searchFilters.rarities = []"
                v-text="$t('all')"
              />
            </v-row>
            <v-row>
              <v-menu :close-on-content-click="false" open-on-hover offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    Dropdown
                  </v-btn>
                </template>

                <v-card>
                  <v-subheader>Inventaire</v-subheader>

                  <v-list>
                    <v-list-item-group v-model="searchFilters.categories" multiple>
                      <v-container>
                        <table class="inventory-grid">
                          <tr>
                            <td><equipment-category-tile :category="inventory.helmet" /></td>
                            <td />
                            <td />
                            <td />
                            <td />
                            <td><equipment-category-tile :category="inventory.cloak" /></td>
                          </tr>
                          <tr>
                            <td><equipment-category-tile :category="inventory.amulet" /></td>
                            <td />
                            <td />
                            <td />
                            <td />
                            <td><equipment-category-tile :category="inventory.epaulettes" /></td>
                          </tr>
                          <tr>
                            <td><equipment-category-tile :category="inventory.breastplate" /></td>
                            <td />
                            <td />
                            <td />
                            <td />
                            <td><equipment-category-tile :category="inventory.belt" /></td>
                          </tr>
                          <tr>
                            <td><equipment-category-tile :category="inventory.ring" /></td>
                            <td />
                            <td />
                            <td />
                            <td />
                            <td><equipment-category-tile :category="inventory.ring" /></td>
                          </tr>
                          <tr>
                            <td><equipment-category-tile :category="inventory.boots" /></td>
                            <td />
                            <td>
                              <equipment-category-tile :category="inventory.oneHandedWeapon" />
                            </td>
                            <td><equipment-category-tile :category="inventory.tool" /></td>
                            <td />
                            <td><equipment-category-tile :category="inventory.pet" /></td>
                          </tr>
                          <tr>
                            <td><equipment-category-tile :category="inventory.costume" /></td>
                            <td>
                              <equipment-category-tile :category="inventory.secondaryWeapon" />
                            </td>
                            <td>
                              <equipment-category-tile :category="inventory.twoHandedWeapon" />
                            </td>
                            <td><equipment-category-tile :category="inventory.emblem" /></td>
                            <td><equipment-category-tile :category="inventory.mount" /></td>
                            <td />
                          </tr>
                        </table>
                      </v-container>

                      <v-container>
                        <v-list-item
                          v-for="{ category, name } in Object.entries(
                            $i18n.messages[$i18n.locale].categoryNames,
                          )
                            .map(([key, name]) => ({ category: parseInt(key), name }))
                            .filter(({ category }) => !allEquipments.includes(category))"
                          :key="category"
                          :value="category"
                        >
                          <v-list-item-avatar size="20" rounded>
                            <v-img
                              :src="
                                require('@/assets/item-category/' + categoryIcon(category) + '.png')
                              "
                            ></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              {{ name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-container>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </v-menu>
            </v-row>
          </v-container>
        </v-slide-y-transition>

        <v-container>
          <v-row>
            <v-subheader>{{ $t("results") }}: {{ sortedItems.length }}</v-subheader>
            <v-spacer />
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
                  <v-icon v-if="sortBy.value === value && sortBy.descending">mdi-arrow-down</v-icon>
                  <v-icon v-else-if="sortBy.value === value && !sortBy.descending"
                    >mdi-arrow-up</v-icon
                  >
                </v-slide-x-transition>
              </v-chip>
            </v-chip-group>
          </v-row>
        </v-container>

        <v-list>
          <v-list-item-group v-model="selectedItems"  multiple>
            <v-virtual-scroll bench="10" :items="sortedItems" height="400" item-height="60">
              <template v-slot:default="{ item }">
                <v-list-item :key="item.id" :value="item" :class="`raerity-${item.rarity}`">
                  <v-list-item-avatar size="42" rounded>
                    <v-img
                      class="item-image"
                      :src="`https://vertylo.github.io/wakassets/items/${item.gfxId}.png`"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center">
                      <img
                        v-if="item.rarity > 0 && item.rarity < 10"
                        :src="require('@/assets/rarity/' + item.rarity + '.png')"
                        class="mr-2"
                      />
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
    </v-col>
    <v-col><market :items="selectedItems.length ? selectedItems : sortedItems"></market></v-col>
  </v-row>
</template>

<script lang="ts">
import { allEquipments, inventory, parentCategory } from "@/data/item-category"
import { itemInfo, ItemInfo } from "@/data/items"
import Fuse from "fuse.js"
import latinize from "latinize"
import Vue from "vue"
import EquipmentCategoryTile from "./EquipmentCategoryTile.vue"
import Market from "./Market.vue"

function normalize(str: string) {
  str = latinize(str)
  str = str.replace(/[-°/]/g, " ")
  str = str.replace(/[()"'!?’‘.,«»:]/g, "")
  str = str.replace(/ {2}/g, " ")
  return str
}

interface SearchFilters {
  search: string
  level: [number, number]
  categories: number[]
  rarities: number[]
}
const defaultSearchFilters: () => SearchFilters = () => ({
  search: "",
  level: [0, 215],
  categories: [],
  rarities: [],
})

export interface ItemInfoWithName extends ItemInfo {
  name: string
  nameNormalized: string
}

export default Vue.extend({
  components: {
    //WakfuItem,
    EquipmentCategoryTile,
    Market,
  },
  props: {},
  data: function() {
    return {
      allEquipments,
      inventory,
      searchFilters: defaultSearchFilters(),
      showFilters: true,
      sortBy: {
        value: null as null | string,
        descending: true,
      },
      selectedItems: [],
    }
  },
  computed: {
    localizedItems(): ItemInfoWithName[] {
      return Object.entries(this.$i18n.messages[this.$i18n.locale].itemNames).map(([id, name]) => ({
        name: name as string,
        nameNormalized: normalize(name),
        ...itemInfo.get(parseInt(id))!,
      }))
    },
    filteredItems(): ItemInfoWithName[] {
      return this.localizedItems.filter((item) => {
        const categoryOk = this.searchFilters.categories.length
          ? this.searchFilters.categories.includes(item.type)
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
      if (this.searchFilters.search === "") {
        return this.filteredItems
      }
      const pattern = normalize(this.searchFilters.search)
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
      console.log("searchResultItems changed")
      this.selectedItems = []
    },
    sortedItems() {
      ;(window as any).sortedItems = this.sortedItems
    },
  },
  methods: {
    categoryIcon(category: number) {
      return parentCategory[category] ?? category
    },
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
  },
})
</script>
