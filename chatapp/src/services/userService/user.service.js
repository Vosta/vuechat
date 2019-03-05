import { TokenService } from '../storage.service';
import { ApiService } from '../api.service';
import AuthenticationError from '../error.service';


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
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    addContact: async function (url, token, userId){
        const requestData = {
            method: 'post',
            url: url,
            data: { token, userId }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
    removeContact: async function (url, token, contactId){
        const requestData = {
            method: 'post',
            url: url,
            data: { token, contactId }
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
