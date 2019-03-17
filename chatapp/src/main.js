import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VeeValidate from 'vee-validate';
import VueSocketIO from 'vue-socket.io';


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


Vue.config.productionTip = false;

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000',
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_SET_'
  },
}));

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
