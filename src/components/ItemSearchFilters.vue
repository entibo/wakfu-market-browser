<template>
  <v-container>
    <v-row align="center">
      <v-subheader v-text="$t('level')" />
      <v-col>
        <v-range-slider
          v-model="itemSearchFilters.level"
          step="1"
          min="0"
          max="215"
          hide-details
          class="align-center"
        >
          <template v-slot:prepend>
            <v-text-field
              :value="itemSearchFilters.level[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 50px"
              @change="$set(itemSearchFilters.level, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="itemSearchFilters.level[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 50px"
              @change="$set(itemSearchFilters.level, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-col>
      <div style="min-width: 44px">
        <v-slide-x-transition>
          <v-btn
            v-if="itemSearchFilters.level[0] !== 0 || itemSearchFilters.level[1] !== 215"
            icon
            @click="itemSearchFilters.level = [0, 215]"
          >
            <v-icon>mdi-backspace </v-icon>
          </v-btn>
        </v-slide-x-transition>
      </div>
    </v-row>
    <v-row align="center" class="flex-nowrap">
      <v-subheader v-text="$t('rarity')" />
      <v-list>
        <v-list-item-group v-model="itemSearchFilters.rarities" multiple class="d-flex">
          <v-list-item
            v-for="rarity in [1, 2, 3, 4, 5, 6, 7]"
            :key="rarity"
            :value="rarity"
            color="primary"
            dense
          >
            <v-list-item-content>
              <img :src="require('@/assets/rarity/' + rarity + '.png')" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <!-- <v-chip
                
                color="primary"
                @click="itemSearchFilters.rarities = []"
                v-text="$t('all')"
              /> -->
      <v-spacer></v-spacer>
      <div style="min-width: 44px">
        <v-slide-x-transition>
          <v-btn
            v-if="itemSearchFilters.rarities.length"
            icon
            @click="itemSearchFilters.rarities = []"
          >
            <v-icon>mdi-backspace </v-icon>
          </v-btn>
        </v-slide-x-transition>
      </div>
    </v-row>
    <v-row align="center">
      <v-subheader v-text="$t('type')" />

      <v-col>
        <item-type-select v-model="itemSearchFilters.categories" />
      </v-col>

      <div style="min-width: 44px">
        <v-slide-x-transition>
          <v-btn
            v-if="itemSearchFilters.categories.length"
            icon
            @click="itemSearchFilters.categories = []"
          >
            <v-icon>mdi-backspace </v-icon>
          </v-btn>
        </v-slide-x-transition>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import ItemTypeSelect from "@/components/ItemTypeSelect.vue"

export interface ItemSearchFilters {
  level: [number, number]
  categories: number[]
  rarities: number[]
}
export const defaultItemSearchFilters: () => ItemSearchFilters = () => ({
  level: [0, 215],
  categories: [],
  rarities: [],
})

export default Vue.extend({
  components: {
    //WakfuItem,
    ItemTypeSelect,
  },
  props: {
    value: {
      required: true,
      type: Object as PropType<ItemSearchFilters>,
    },
  },
  data() {
    return {
      itemSearchFilters: this.value,
    }
  },
  watch: {
    value() {
      this.itemSearchFilters = this.value
    },
  },
})
</script>
