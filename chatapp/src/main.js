import Vue from 'vue'
import './plugins/vuetify'
import Vuetify, {
    VApp,
    VLayout,
    VCard,
    VFlex,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition
} from 'vuetify/lib'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  components: {
    VApp,
    VLayout,
    VCard,
    VFlex,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
