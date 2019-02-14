import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'
import { UserService, AuthenticationError } from '../services/user.service'
import { TokenService } from '../services/storage.service'
import { ApiService } from '../services/api.service';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authenticating: false,
        accessToken: TokenService.getToken(),
        authenticationError: ''
    },
    getters: {
        loggedIn: (state) => {
            return state.accessToken ? true : false
        },

        authenticationError: (state) => {
            return state.authenticationError
        },

        authenticating: (state) => {
            return state.authenticating
        }
    },
    mutations: {
        authenticationRequest(state) {
            state.authenticating = true;
            state.authenticationError = ''
        },

        authenticationSuccess(state, accessToken) {
            state.accessToken = accessToken
            state.authenticating = false;
        },
        SET_authenticationError(state, errorMessage ) {
            state.authenticating = false;
            state.authenticationError = errorMessage;
        },

        logoutSuccess(state) {
            state.accessToken = '';
        }
    },
    actions: {
        async signUp({ commit }, creditentials) {
            commit('authenticationRequest');
            try {
                const token = await UserService.authRequest(ApiService.SIGNUP_URL,creditentials);
                commit('authenticationSuccess', token);
                router.push('/home');

                return true;
            } catch (error) {
                console.log(error);
                if(error instanceof AuthenticationError){
                    commit('SET_authenticationError', error.message);
                }
                return false;
            }
        },
        async login({ commit }, creditentials) {
            commit('authenticationRequest');
            try {
                const token = await UserService.authRequest(ApiService.LOGIN_URL,creditentials);
                commit('authenticationSuccess', token);
                // Redirect the user to the page he first tried to visit or to the home view
                router.push(router.history.current.query.redirect || '/home');
    
                return true
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    commit('SET_authenticationError', error.message);
                }
    
                return false;
            }
        },
        async logout({ commit }) {
            UserService.logout();
            //remove the token from store
            commit('authenticationSuccess');
            router.push('/login');
        }
    },
})