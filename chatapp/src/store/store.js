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
        contacts: [],
        chats: []
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
        },
        contacts: (state) =>{
            return state.contacts
        },
        chats: (state) =>{
            return state.chats
        }
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
        SET_contacts(state, contacts){
            state.contacts = contacts;
        },
        SET_chats(state, chats){
            state.chats = chats;
        }
    },
    actions: {
        async requestContacts({ commit }){
            try {
                const token = TokenService.getToken();
                const information = await UserService.contactsRequest(ApiService.INFO_URL, token);
                console.log(information)
                commit('SET_contacts', information.data.contacts);
                commit('SET_chats', information.data.chats);
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
                const token = await UserService.authRequest(ApiService.LOGIN_URL,creditentials);
                commit('SET_authenticationSuccess', token);
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