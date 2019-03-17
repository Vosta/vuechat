import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import UserService from '../services/userService/user.service';
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
            username: '',
            avatar: '',
            contacts: [],
            contactsData: [],
            contactRequests: [],
            chats: [],
        },
        notification: '',
        search: {
            status: false,
            value: '',
            data: []
        },
        chat: {
            messages: [],
            status: false,
            id: '',
            toolbar: {
                avatar: '',
                name: ''
            }
        }
    },
    getters: {
        loggedIn: (state) => {
            return state.auth.accessToken ? true : false;
        },
        authToken: (state) => {
            return state.auth.accessToken;
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
        search: (state) => {
            return state.search;
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
        currentChat: (state) => {
            return state.chat
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
        SOCKET_SET_USER(state, payload) {
            state.user = payload;
        },
        SET_CHAT_TOOLBAR(state, payload) {
            state.chat.toolbar = payload;
        },
        SET_CHAT_STATUS(state, value) {
            state.chat.status = value;
        },
        SOCKET_SET_CHAT_DATA(state, payload) {
            state.chat.messages = payload.messages;
            state.chat.id = payload.chatId;
        },
        SOCKET_SET_USER_CHAT_STATUS(state, payload) {
            const message = {
                content: payload,
                info: true
            }
            state.chat.messages.push(message);
        },
        SOCKET_SET_MESSAGE(state, payload) {
            state.chat.messages.push(payload.message);
        },
        SOCKET_SET_SEARCH_DATA(state, payload){
            state.search.data = payload;
            state.search.status = true;
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
            state.search.status = status;
            if (!status) state.search.data = [];
        },
        SET_searchValue(state, value) {
            state.search.value = value;
        },
        SET_chats(state, payload) {
            state.user.chats = payload;
        },
        SET_chatId(state, value) {
            state.chat.id = value;
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
        SOCKET_SET_CONTACT_STATUS(state, contact) {
            for (const key of state.user.contactsData.keys()) {
                if (state.user.contactsData[key]._id === contact.id) {
                    state.user.contactsData[key].active = contact.status;
                    break;
                }
            }
        },
        SET_contactRequests(state, payload) {
            state.user.contactRequests = payload;
        },
        SET_NewChatRequest(state, payload) {
            state.user.contactRequests.push(payload);
        },
        SET_notification(state, payload) {
            state.notification = payload;
        }
    },
    actions: {
        openChat({ commit }, data) {
            commit('SET_CHAT_TOOLBAR', { name: data.chatData.name, avatar: data.chatData.avatar });
            commit('SET_CHAT_STATUS', true);
            //send contactId, 
            this._vm.$socket.emit('JOIN_ROOM', {
                direct: data.direct,
                chatData: data.chatData
            });
        },
        async addContact({ commit, dispatch }, data) {
            try {
                //const response = await UserService.addContact(ApiService.ADD_CONTACT_URL, token, data);
                this._vm.$socket.emit('ADD_CONTACT', data);
                /*commit('SET_currentUser', response.user);
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
                if (!data.fromRequest) {
                    this._vm.$socket.emit("addContact", response.contact._id);
                }
                return true; }*/
            } catch (error) {
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
        async searchData({ commit }, data) {
            try {
                console.log(result)
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
        
        async removeContact({ commit }, contact) {
            try {
                if (contact.username === this.getters.currentChat.name) {
                    commit('SET_CHAT_STATUS', false);
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
                if (chatId === this.getters.chat.id) {
                    commit('SET_CHAT_STATUS', false);
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
        /*async openChat({ commit }, data) {
            try {
                commit('SET_CHAT_STATUS', true);
                const token = TokenService.getToken();
                const chatData = await ChatService.chatRequest(ApiService.CHAT_URL, token, data);
                console.log(chatData)
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

        },*/
        async logout({ commit }) {
            //remove the token from store
            UserService.logout();
            this._vm.$socket.emit('userDisconnect');
            commit('SET_logoutSuccess');
            commit('SET_chatContent');
            commit('SET_CHAT_STATUS');
            commit('SET_authenticationSuccess');
            commit('SET_searchStatus');
            commit('SET_searchedData');
            router.push('/login');
        }
    },
})