import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/home.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path:'/home',
      component: Home
    }
  ]
})
