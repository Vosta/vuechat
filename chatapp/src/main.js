import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VeeValidate from 'vee-validate';
import VueSocketio from 'vue-socket-io';
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

Vue.use(VeeValidate);
Vue.use(Vuetify, {
  iconfont: 'mdi',
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
Vue.use(VueSocketio, 'http://localhost:5000');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
