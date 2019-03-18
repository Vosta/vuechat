import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/home.vue'
import store from './store/store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    },

  ],

});

router.beforeEach((from, to, next) => {
  if(store.getters.loggedIn){
    //test the token to see if its valid
    if(from.name === 'login'){
      next('/home');
    }
  next();
  } else {
    if(from.name !== 'login'){
      store.commit('SET_authenticationError','Token expired')
      next('/login');
    }
    next();
  }
});

export default router;
