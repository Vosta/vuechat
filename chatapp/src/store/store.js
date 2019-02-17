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
        authenticationError: '',
        user: {},
    },
    getters: {
        loggedIn: (state) => {
            return state.accessToken ? true : false;
        },

        authenticationError: (state) => {
            return state.authenticationError;
        },

        authenticating: (state) => {
            return state.authenticating;
        },
        user: (state) => {
            return state.user;
        },
    },
    mutations: {
        SET_authenticationRequest(state) {
            state.authenticating = true;
            state.authenticationError = ''
        },

        SET_authenticationSuccess(state, accessToken) {
            state.accessToken = accessToken
            state.authenticating = false;
        },
        SET_authenticationError(state, errorMessage ) {
            state.authenticating = false;
            state.authenticationError = errorMessage;
        },

        SET_logoutSuccess(state) {
            state.accessToken = '';
        },
        SET_user(state, user){
            state.user = user
        },
    },
    actions: {
        async requestContacts({ commit }){
            try {
                const token = TokenService.getToken();
                const user = await UserService.contactsRequest(ApiService.INFO_URL, token);
                commit('SET_user', user);
                return true;
            } catch (error) {
                console.log(error);
                if(error instanceof AuthenticationError){
                    commit('SET_authenticationError', error.message);
                }
                return false;
            }
        },
        async signUp({ commit }, creditentials) {
            commit('SET_authenticationRequest');
            try {
                const token = await UserService.authRequest(ApiService.SIGNUP_URL,creditentials);
                commit('SET_authenticationSuccess', token);
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
            commit('SET_authenticationRequest');
            try {
                const data = await UserService.authRequest(ApiService.LOGIN_URL,creditentials);
                commit('SET_authenticationSuccess', data.token);
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
            commit('SET_authenticationSuccess');
            commit('SET_logoutSuccess');
            router.push('/login');
        }
    },
})