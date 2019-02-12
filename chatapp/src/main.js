import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Vuetify
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
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
