import Vue from "vue"
import Vuetify from "vuetify/lib/framework"
import colors from "vuetify/lib/util/colors"

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        "rarity-0": colors.grey.lighten1,
        "rarity-1": undefined,
        "rarity-2": colors.green.accent3,
        "rarity-3": colors.orange.lighten1,
        "rarity-4": colors.yellow.accent4,
        "rarity-5": colors.purple.accent1,
        "rarity-6": colors.lightBlue.lighten1,
        "rarity-7": colors.pink.accent1,
      },
      light: {
        "rarity-0": undefined,
        "rarity-1": colors.grey.darken3,
        "rarity-2": colors.green.accent4,
        "rarity-3": colors.orange.accent4,
        "rarity-4": colors.yellow.darken2,
        "rarity-5": colors.purple.accent4,
        "rarity-6": colors.lightBlue.accent4,
        "rarity-7": colors.pink.accent4,
      },
    },
  },
})
