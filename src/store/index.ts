import Vue from "vue"
import Vuex from "vuex"
import VuexPersistence from "vuex-persist"
import favorites from "./favorites"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    favorites,
  },
  plugins: [new VuexPersistence({ modules: ["favorites"] }).plugin],
})
