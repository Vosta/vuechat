import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { UserService, AuthenticationError } from '../services/user.service'
import { TokenService } from '../services/storage.service'
import { ApiService } from '../services/api.service';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        auth: {
            authenticating: false,
            authenticationError: '',
            accessToken: TokenService.getToken(),
        },
        avatarDialog: {
            avatars: [],
            avatarDialog: false,
            currentAvatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/f19a8dbd-b9e4-4ce8-9726-5a1412453ce7/dabkn0i-75879278-83f3-48cc-bf00-c9cd607b5224.png',

        },
        user: {
            currentUser: {
                username: '',
                avatar: ''
            },
            contacts: []
        },
        search: {
            searchStatus: false,
            searchValue: '',
            searchedData: []
        }

    },
    getters: {
        loggedIn: (state) => {
            return state.auth.accessToken ? true : false;
        },

        authenticationError: (state) => {
            return state.auth.authenticationError;
        },

        authenticating: (state) => {
            return state.auth.authenticating;
        },
        user: (state) => {
            return state.user;
        },
        searchedData: (state) => {
            return state.search.searchedData;
        },
        searchStatus: (state) => {
            return state.search.searchStatus;
        },
        searchValue: (state) => {
            return state.search.searchValue;
        },
        avatarDialog: (state) => {
            return state.avatarDialog.avatarDialog;
        },
        avatars: (state) => {
            return state.avatarDialog.avatars;
        },
        currentAvatar: (state) => {
            return state.avatarDialog.currentAvatar;
        }
    },
    mutations: {

        SET_authenticationRequest(state) {
            state.auth.authenticating = true;
            state.auth.authenticationError = '';
        },

        SET_authenticationSuccess(state, accessToken) {
            state.auth.accessToken = accessToken
            state.auth.authenticating = false;
        },

        SET_authenticationError(state, errorMessage) {
            state.auth.authenticating = false;
            state.auth.authenticationError = errorMessage;
        },
        SET_logoutSuccess(state) {
            state.auth.accessToken = '';
        },

        SET_user(state, data) {
            state.user = {
                currentUser: data.user,
                contacts: data.contacts
            }
        },
        SET_avatars(state, avatars) {
            state.avatarDialog.avatars = avatars;
        },
        SET_currentAvatar(state, avatar) {
            state.avatarDialog.currentAvatar = avatar;
        },
        SET_avatarDialog(state, status) {
            state.avatarDialog.avatarDialog = status;
        },
        SET_searchStatus(state, status) {
            state.search.searchStatus = status;
            if (!status) {
                state.search.searchedData = [];
                state.search.searchValue = '';
            }
        },
        SET_searchValue(state, value) {
            state.search.searchValue = value;
        },
        SET_searchedData(state, value) {
            state.search.searchedData = value;
        },


    },
    actions: {
        async requestContacts({ commit }) {
            try {
                const token = TokenService.getToken();
                const data = await UserService.contactsRequest(ApiService.INFO_URL, token);
                commit('SET_user', data);
                return true;
            } catch (error) {
                console.log(error);
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async getAvatars({ commit }) {
            try {
                const avatars = await UserService.loadAvatars(ApiService.AVATARS_URL);
                commit('SET_avatars', avatars);
                return true;
            } catch (error) {
                console.log(error);
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async signUp({ commit }, creditentials) {
            commit('SET_authenticationRequest');
            try {
                const token = await UserService.authRequest(ApiService.SIGNUP_URL, creditentials);
                commit('SET_authenticationSuccess', token);
                router.push('/home');

                return true;
            } catch (error) {
                console.log(error);
                if (error instanceof AuthenticationError) {
                    commit('SET_authenticationError', error.message);
                }
                return false;
            }
        },
        async login({ commit }, creditentials) {
            commit('SET_authenticationRequest');
            try {
                const data = await UserService.authRequest(ApiService.LOGIN_URL, creditentials);
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
        async searchData({ commit }, searchData) {
            try {
                const queryedContacts = await UserService.searchData(ApiService.SEARCH_URL, searchData);
                console.log(queryedContacts)
                commit('SET_searchedData', queryedContacts);
                commit('SET_searchStatus', true);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    commit('SET_authenticationError', error.message);
                }

                return false;
            }

        },
        async addContact({ commit }, username) {
            try {
                const token = TokenService.getToken();
                const response = await UserService.addContact(ApiService.ADD_CONTACT_URL, token, username);
                console.log(response);
                commit('SET_user', response)
                commit('SET_searchStatus', false);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async logout({ commit }) {
            UserService.logout();
            //remove the token from store
            commit('SET_authenticationSuccess');
            commit('SET_logoutSuccess');
            commit('SET_searchStatus');
            commit('SET_searchedData');
            router.push('/login');
        }
    },
})