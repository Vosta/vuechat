import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import UserService from '../services/userService/user.service';
import { ChatService } from '../services/userService/chat.service';
import { SearchService } from '../services/userService/search.service';
import { TokenService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import AuthenticationError from '../services/error.service';
import defaultState from './defaultState'
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
            contacts: [],
            contactRequests: [],
            chats: [],
        },
        notification: '',
        search: {
            searchStatus: false,
            searchValue: '',
            searchedData: []
        },
        chat: {
            messages: [],
            socketId: '',
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
        },
        socketId: (state) => {
            return state.chat.socketId
        },
        activeUsers: (state) => {
            return state.activeUsers
        },
        allActiveContacts: (state) => {
            return state.activeContacts
        },
        notification: (state) => {
            return state.notification
        },
    },
    mutations: {
        SET_DefaultState(state) {
            state = defaultState;
        },
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
                contacts: data.contacts,
                chats: data.chats,
                contactRequests: data.contactRequests,
                pendingContactRequests: data.pendingContactRequests
            }
        },
        SET_userContacts(state, payload) {
            state.user.contacts = payload;
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
        SET_chats(state, payload) {
            state.user.chats = payload;
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
        SET_chatContent(state, value) {
            state.chat.messages = value;
        },
        SET_socketId(state, value) {
            state.chat.socketId = value;
        },
        SET_Message(state, payload) {
            state.chat.messages.push(payload.message);
            /*if (state.chat.chatId !== payload.chatId) {
                //give that chat an unread message badge
                //give the whole chat tab an unread message tab
            }*/
        },
        SET_contactStatus(state, contact) {
            for (const index of state.user.contacts.keys()) {
                if (state.user.contacts[index]._id === contact.id) {
                    state.user.contacts[index].active = contact.status;
                    break;
                }
            }
        },
        SET_contactRequests(state, payload) {
            state.user.contactRequests = payload;
        },
        SET_NewChatRequest(state, payload){
            state.user.contactRequests.push(payload);
        },
        SET_notification(state, payload) {
            state.notification = payload;
        }
    },
    actions: {
        async requestData({ commit }) {
            try {
                const token = TokenService.getToken();
                const data = await UserService.requestData(ApiService.USER_DATA_URL, token);
                commit('SET_user', data);
                console.log(data)
                await this._vm.$socket.emit('userLoggedIn', data);
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
                console.log(error)
                if (error instanceof AuthenticationError) {
                    commit('SET_authenticationError', error.message);
                }
                return false;
            }
        },
        async searchData({ commit }, searchValue) {
            try {
                const token = TokenService.getToken();
                const queryedContacts = await SearchService.searchData(ApiService.SEARCH_URL, token, searchValue);
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
        async getContact({ commit }, contactId) {
            try {
                const token = TokenService.getToken();
                const contact = await UserService.getContact(ApiService.GET_CONTACT_URL, token, contactId);
                console.log(contact)
                commit('SET_NewChatRequest', contact);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async addContact({ commit, dispatch }, data) {
            try {
                const token = TokenService.getToken();
                const response = await UserService.addContact(ApiService.ADD_CONTACT_URL, token, data);
                console.log(response)
                commit('SET_userContacts', response.contacts);
                commit('SET_contactRequests', response.contactRequests);
                commit('SET_notification', response.notification);
                commit('SET_searchStatus', false);
                const openChatData = {
                    direct: true,
                    name: response.contact.username,
                    avatar: response.contact.avatar,
                    contact: response.contact
                }
                dispatch('openChat', openChatData);
                if(!data.fromRequest){
                    this._vm.$socket.emit("addContact", response.contact._id);
                }
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async removeContact({ commit }, contact) {
            try {
                if (contact.username === this.getters.chatName) {
                    commit('SET_chatStatus', false);
                }
                const token = TokenService.getToken();
                const response = await UserService.removeContact(ApiService.REMOVE_CONTACT_URL, token, contact._id);
                commit('SET_userContacts', response.contacts);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async removeChat({ commit }, chatId) {
            try {
                if (chatId === this.getters.chatId) {
                    commit('SET_chatStatus', false);
                }
                const token = TokenService.getToken();
                const response = await UserService.removeChat(ApiService.REMOVE_CHAT_URL, token, chatId);
                console.log(response)
                commit('SET_chats', response.chats);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }
        },
        async openChat({ commit }, data) {
            try {
                commit('SET_chatStatus', true);
                commit('SET_chatAvatar', data.avatar);
                commit('SET_chatName', data.name);
                const token = TokenService.getToken();
                const chatData = await ChatService.chatRequest(ApiService.CHAT_URL, token, data);
                await this._vm.$socket.emit('JOIN_ROOM', {
                    user: this.getters.user.currentUser,
                    chatId: chatData.chatId
                });
                if (chatData.chats) {
                    commit('SET_chats', chatData.chats)
                }
                commit('SET_chatContent', chatData.messages);
                commit('SET_chatId', chatData.chatId);
                return true;
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    console.log(error.message)
                }
                return false;
            }

        },
        async sendMessage({ commit }, messageData) {
            const token = TokenService.getToken();
            const updatedChat = await ChatService.sendMessage(ApiService.MESSAGES_URL, token, messageData);
            console.log(updatedChat)
            commit('SET_Message', updatedChat);
            return true;
        },
        async logout({ commit }) {
            //remove the token from store
            UserService.logout();
            this._vm.$socket.emit('userDisconnect');
            commit('SET_logoutSuccess');
            commit('SET_chatContent');
            commit('SET_chatStatus');
            commit('SET_authenticationSuccess');
            commit('SET_searchStatus');
            commit('SET_searchedData');
            router.push('/login');
        }
    },
})