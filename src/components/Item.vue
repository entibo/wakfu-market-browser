<template>
  <div v-if="info" class="d-flex flex" :style="style">
    <v-list-item-avatar :size="dense ? 42 : 42" rounded>
      <v-img
        class="item-image"
        :src="`https://vertylo.github.io/wakassets/items/${info.gfxId}.png`"
      ></v-img>
    </v-list-item-avatar>

    <v-list-item-avatar size class="mr-1">
      <img
        v-if="info.rarity > 0 && info.rarity < 10"
        :src="require('@/assets/rarity/' + info.rarity + '.png')"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title
        class="d-inline-block text-truncate"
        :class="`rarity-${info.rarity}--text ${dense ? 'body-2 pt-1' : ''}`"
      >
        {{ info.name }}
      </v-list-item-title>
    </v-list-item-content>

    <div class="d-flex align-center">
      <div class="text-caption pt-1 mx-2">
        {{ $t("level-abbreviated") }}
        <strong>{{ level !== undefined ? level : info.level }}</strong>
      </div>
      <img style="opacity: 0.9" :src="require('@/assets/item-category/' + categoryIcon + '.png')" />
    </div>

    <div v-if="showFavorite" class="d-flex">
      <v-divider vertical class="ml-4" />
      <v-list-item-action v-if="showFavorite" @click.stop @mousedown.stop>
        <v-btn v-if="isFavorite(info.id)" icon @click="deleteFavorite(info.id)">
          <v-icon color="amber">mdi-star</v-icon>
        </v-btn>
        <v-btn v-else icon @click="addFavorite(info.id)">
          <v-icon color="grey">mdi-star-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </div>
  </div>
  <div v-else class="d-flex flex" :style="style">
    <v-list-item-content>
      <v-list-item-title
        class="d-inline-block text-truncate"
        :class="`${dense ? 'body-2 pt-1' : ''}`"
      >
        {{ $t("unknown-item") }} <strong>({{id}})</strong>
      </v-list-item-title>
    </v-list-item-content>
  </div>
</template>

<script lang="ts">
import { ItemInfoWithName } from "@/components/ItemSearch.vue"
import { parentCategory } from "@/data/item-category"
import { itemInfoMap } from "@/data/items"
import Vue from "vue"
import { mapGetters, mapMutations } from "vuex"
export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      default: undefined,
    },
    showFavorite: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters("favorites", {
      isFavorite: "has",
    }),
    info(): ItemInfoWithName | null {
      const info = itemInfoMap.get(this.id)
      if (!info) return null
      const name = this.$t("itemNames." + this.id) as string
      return {
        ...info,
        name,
      }
    },
    categoryIcon(): number {
      if (!this.info) return -1
      return parentCategory[this.info.type] ?? this.info.type
    },
    style(): string {
      return this.width ? `width: ${this.width}px` : ""
    },
  },
  methods: {
    ...mapMutations("favorites", {
      addFavorite: "add",
      deleteFavorite: "delete",
    }),
  },
})
</script>
