import Vue from "vue"
import Vuetify from "vuetify/lib/framework"
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        "rarity-0": colors.grey.lighten1,
        "rarity-1": undefined,
        "rarity-2": colors.green.lighten1,
        "rarity-3": colors.orange.lighten1,
        "rarity-4": colors.yellow.lighten1,
        "rarity-5": colors.purple.lighten1,
        "rarity-6": colors.lightBlue.lighten1,
        "rarity-7": colors.pink.lighten1,
      },
      light: {
        "rarity-0": colors.grey.lighten3,
        "rarity-1": colors.shades.white,
        "rarity-2": colors.green.lighten3,
        "rarity-3": colors.orange.lighten3,
        "rarity-4": colors.yellow.lighten3,
        "rarity-5": colors.purple.lighten3,
        "rarity-6": colors.lightBlue.lighten3,
        "rarity-7": colors.pink.lighten3,
      },
    }
  },
})
