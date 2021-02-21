<template>
  <v-tooltip left right>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item
        v-bind="attrs"
        :value="category"
        color="primary"
        class="px-0 justify-center"
        dense
        v-on="on"
      >
        <img :src="require('@/assets/item-category/' + category + '.png')" />
      </v-list-item>
    </template>
    <span v-text="$t('categoryNames.' + category)" />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    category: {
      required: true,
      type: Number,
    },
  },
})
</script>
