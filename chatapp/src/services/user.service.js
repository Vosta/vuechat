import { TokenService } from './storage.service';
import { ApiService } from './api.service';

class AuthenticationError extends Error {
    constructor(message) {
        super(message),
            this.name = this.constructor.name,
            this.message = message
    }
}

const UserService = {
    authRequest: async function (url, creditentials) { 
        const requestData = {
            method: 'post',
            url,
            data: creditentials
        }
        try {
            const response = await ApiService.customRequest(requestData);
            console.log(response)
            TokenService.saveToken(response.data.token);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    loadAvatars: async function (url){
        const requestData = {
            method: 'get',
            url,
        }
        try {
            const avatars = await ApiService.customRequest(requestData);
            return avatars.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    contactsRequest: async function (url, token) { 
        const requestData = {
            method: 'post',
            url,
            data: { token }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            console.log(response);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    searchData: async function (url, searchData){
        const requestData = {
            method: 'post',
            url: url,
            data: searchData
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    addContact: async function (url, token, username){
        const requestData = {
            method: 'post',
            url: url,
            data: { token, username }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    logout: async function () {
        TokenService.removeToken();
    }
}

export default UserService;

export { UserService, AuthenticationError};