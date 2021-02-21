<style lang="scss" scoped>
.inventory-grid {
  td {
    //background: greenyellow;
    width: 40px;
    height: 40px;
  }
}
</style>

<template>
  <v-select
    ref="vselect"
    :value="internalValue"
    :items="selectItems"
    label="Filtrer par catégorie(s)"
    multiple
    :chips="!!internalValue.length"
    dense
    hide-details
    :menu-props="{ 'content-class': 'overflow-hidden' }"
  >
    <template v-slot:selection="{ item }">
      <v-chip class="px-1" @click.stop="unselect(item)">
        <v-img :src="require('@/assets/item-category/' + categoryIcon(item) + '.png')"></v-img>
      </v-chip>
      <!-- <span v-if="index === 6" class="grey--text caption">
          ...
        </span> -->
    </template>
    <template v-slot:no-data>
      <!-- <v-subheader>Inventaire</v-subheader> -->

      <v-list class="py-0">
        <v-list-item-group v-model="internalValue" multiple>
          <v-row>
            <v-col>
              <v-container ref="inventoryGridEl">
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
                    <td @click.stop.prevent="selectAllEquipments">
                      <equipment-category-tile :category="-1" />
                    </td>
                  </tr>
                </table>
              </v-container>
            </v-col>
            <v-divider vertical />
            <v-col class="pl-0">
              <v-container class="overflow-y-auto" style="max-height: 278px">
                <v-list-item
                  v-for="{ category, name } in allCategories.filter(
                    ({ category }) => !allEquipments.includes(category),
                  )"
                  :key="category"
                  :value="category"
                  dense
                  color="primary"
                >
                  <v-list-item-avatar size="20" rounded>
                    <v-img
                      :src="require('@/assets/item-category/' + categoryIcon(category) + '.png')"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-container>
            </v-col>
          </v-row>
        </v-list-item-group>
      </v-list>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { allEquipments, inventory, parentCategory } from "@/data/item-category"
import EquipmentCategoryTile from "./EquipmentCategoryTile.vue"
export default Vue.extend({
  components: {
    EquipmentCategoryTile,
  },

  props: {
    value: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  data() {
    return {
      allEquipments,
      inventory,
      focused: false,
      vSelectRef: null as any,
      internalValue: this.value,
      allCategories: Object.entries(this.$i18n.messages[this.$i18n.locale].categoryNames).map(
        ([key, name]) => ({
          category: parseInt(key),
          name: name as string,
        }),
      ),
    }
  },
  computed: {
    isMenuActive(): boolean {
      return this.vSelectRef ? this.vSelectRef.isMenuActive : false
    },
    selectItems(): number[] {
      return this.isMenuActive ? [] : this.allCategories.map((x) => x.category)
    },
  },
  watch: {
    value() {
      this.internalValue = this.value
    },
    internalValue() {
      this.$emit("input", this.internalValue)
    },
    focused() {
      console.log("focused:", this.focused)
    },
  },
  mounted() {
    this.vSelectRef = this.$refs.vselect
  },
  methods: {
    categoryIcon(category: number) {
      return parentCategory[category] ?? category
    },
    unselect(item: number) {
      this.internalValue = this.internalValue.filter((x) => x !== item)
    },
    selectAllEquipments() {
      const set = new Set([...this.internalValue, ...allEquipments])
      set.delete(-1)
      this.internalValue = [...set]
    },
  },
})
</script>
