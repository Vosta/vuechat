import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/home.vue'
import axios from 'axios';

Vue.use(Router)

const VERIFY_URL = 'http://localhost:5000/auth/verify';

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login,
      
    },
    {
      path:'/home',
      component: Home
    },
  ],
  
});

export default router;
