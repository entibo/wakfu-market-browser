import Vue from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import vuetify from "./plugins/vuetify"
import { i18n } from "./i18n"
import "./data/items"
import store from "./store"

import VueApexCharts from "vue-apexcharts"
Vue.use(VueApexCharts)
/* Vue.component("apexchart", VueApexCharts) */

Vue.config.productionTip = false

import dayjs from "dayjs"
import RelativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(RelativeTime)

new Vue({
  vuetify,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app")
