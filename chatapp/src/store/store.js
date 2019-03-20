import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import UserService from '../services/userService/user.service';
import { TokenService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import AuthenticationError from '../services/error.service';
Vue.use(Vuex);

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
            currentAvatar: 'https://i.imgur.com/HeygGga.png'
        },
        user: {
            username: '',
            avatar: '',
            contacts: [],
            contactsData: [],
            contactRequests: [],
            contactPendings: [],
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
        SOCKET_SET_SEARCH_DATA(state, payload) {
            state.search.data = payload;
            state.search.status = true;
        },
        SOCKET_SET_REMOVE_CONTACT(state, contactId) {
            state.user.contactsData.forEach((contact, index) => {
                if (contact._id === contactId) {
                    state.user.contactsData.splice(index, 1);
                }
            });
            for (const index of state.user.contactsData) {
                console.log(index)

            }
        },
        SOCKET_SET_CONTACT_REQUEST(state, contact) {
            state.user.contactRequests.push(contact);
        },
        SOCKET_SET_PENDING_CONTACT(state, contact) {
            state.user.contactPendings.push(contact);
        },
        SOCKET_SET_REMOVE_PENDING_REQUEST(state, contactId) {
            state.user.contactPendings.forEach((contact, index) => {
                if (contact._id === contactId) {
                    state.user.contactPendings.splice(index, 1);
                    return;
                }
            });
        },
        SOCKET_SET_ADD_CONTACT(state, contact) {
            state.user.contactsData.push(contact);
            state.user.contactPendings.forEach((contact, index) => {
                if (contact._id === contact._id) {
                    state.user.contactPendings.splice(index, 1);
                    return;
                }
            });
            state.user.contactRequests.forEach((contact, index) => {
                if (contact._id === contact._id) {
                    state.user.contactRequests.splice(index, 1);
                    return;
                }
            });
        },
        SOCKET_SET_NEW_CHAT(state, payload) {
            state.user.chats.push(payload);
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
        SET_SEARCH_STATUS(state, status) {
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
        async signUp({ commit }, creditentials) {
            commit('SET_authenticationRequest');
            try {
                const data = await UserService.authRequest(ApiService.SIGNUP_URL, creditentials);
                commit('SET_authenticationSuccess', data.token);
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
                router.push('/home');
                return true
            } catch (error) {
                console.log(error)
                if (error instanceof AuthenticationError) {
                    commit('SET_authenticationError', error.message);
                }
                return false;
            }
        },
        async logout({ commit }) {
            //remove the token from store
            UserService.logout();
            this._vm.$socket.emit('userDisconnect');
            commit('SET_logoutSuccess');
            commit('SET_chatContent');
            commit('SET_CHAT_STATUS');
            commit('SET_authenticationSuccess');
            commit('SET_SEARCH_STATUS');
            router.push('/login');
        },
        SOCKET_ERROR({ commit, dispatch }, errorMessage) {
            commit('SET_authenticationError', errorMessage);
            dispatch('logout');
        },
        openChat({ commit }, data) {
            commit('SET_CHAT_TOOLBAR', { name: data.chatData.name, avatar: data.chatData.avatar });
            commit('SET_CHAT_STATUS', true);
            //send contactId, 
            this._vm.$socket.emit('JOIN_ROOM', {
                direct: data.direct,
                chatData: data.chatData
            });
        },
        async getAvatars({ commit }) {
            try {
                const avatars = await UserService.avatarsRequest(ApiService.AVATARS_URL);
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

        async removeChat({ commit }, chatId) {
            try {
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

    },
})