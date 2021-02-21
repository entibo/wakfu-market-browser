<template>
  <v-app id="inspire">
    <v-app-bar app flat>
      <v-tabs centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="link in links" :key="link">
          {{ link }}
        </v-tab>
      </v-tabs>

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <lang-flag :iso="$i18n.locale" :squared="false" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="locale in ['fr', 'en', 'es', 'pt']"
            :key="locale"
            @click="() => changeLanguage(locale)"
          >
            <lang-flag :iso="locale" :squared="false" />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <item-search />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { loadLanguageAsync } from "./i18n"
import LangFlag from "vue-lang-code-flags"
import ItemSearch from "./components/ItemSearch.vue"
export default {
  components: {
    LangFlag,
    ItemSearch,
  },
  data: () => ({
    links: ["Foo", "Bar", "Baz"],
  }),
  methods: {
    toggleDarkMode(value: boolean) {
      //this.$vuetify.theme.dark = value
      console.log("Toggling dark mode:", value)
    },
    changeLanguage(value: string) {
      console.log("changeValue:", value)
      loadLanguageAsync(value)
    },
  },
}
</script>
