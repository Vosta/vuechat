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
        },
        chat: {
            messages: [{
                content: '',
                by: '',
                date: 0
            }],
            chatStatus: false,
            chatId: '',
            chatAvatar: '',
            chatName: ''
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
            console.log(state.avatarDialog.currentAvatar)
            return state.avatarDialog.currentAvatar;
        },
        chatStatus: (state) => {
            return state.chat.chatStatus;
        },
        chatId: (state) => {
            return state.chat.chatId;
        },
        chatAvatar: (state) => {
            return state.chat.chatAvatar;
        },
        chatName: (state) => {
            return state.chat.chatName;
        },
        chatMessages: (state) => {
            return state.chat.messages;
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
        SET_chatStatus(state, value) {
            state.chat.chatStatus = value;
        },
        SET_chatId(state, value) {
            state.chat.chatId = value;
        },
        SET_chatAvatar(state, value) {
            state.chat.chatAvatar = value;
        },
        SET_chatName(state, value) {
            state.chat.chatName = value;
        },
        SET_chatContent(state, value){
            state.chat.messages = value;
        },
        ADD_Message(state, payload) {
            console.log(payload)
            state.chat.messages = payload;
        }
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
        async removeContact({ commit }, contactId) {
            try {
                console.log(contactId);
                if(contactId == this.getters.chatId){
                    commit('SET_chatStatus', false);
                }
                const token = TokenService.getToken();
                const response = await UserService.removeContact(ApiService.REMOVE_CONTACT_URL, token, contactId);
                commit('SET_user', response);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async openChat({ commit }, data) {
            commit('SET_chatStatus', true);
            commit('SET_chatAvatar', data.avatar);
            commit('SET_chatName', data.name);
            const token = TokenService.getToken();
            const chatData = await UserService.chatRequest(ApiService.CHAT_URL, token, data.id);
            console.log(chatData);
            commit('SET_chatContent', chatData.messages);
            commit('SET_chatId', chatData.chatId);
            console.log(this.getters.chatId);
            return true;
        },
        async sendMessage({ commit }, message) {
            const messageData = {
                message,
                chatId: this.getters.chatId
            }
            console.log(this.getters.chatId)
            const token = TokenService.getToken();
            const updatedChat = await UserService.sendMessage(ApiService.MESSAGES_URL, token, messageData);
            console.log(updatedChat)
            commit('ADD_Message', updatedChat.messages);
            return true;
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