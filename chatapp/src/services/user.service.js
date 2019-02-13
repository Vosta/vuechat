import { TokenService } from './storage.service';
import { ApiService } from './api.service';
import axios from 'axios';

class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message),
            this.name = this.constructor.name,
            this.message = message,
            this.errorCode = errorCode
    }
}

const UserService = {
    /*signUp: authRequest(ApiService.SIGNUP_URL, creditentials),
    login: async function (ucreditentials) {
        const requestData = {
            method: 'post',
            url: ApiService.LOGIN_URL,
            data: creditentials
        };
        try {
            const response = await ApiService.customRequest(requestData);
            TokenService.saveToken(response.data.token);
            return response.data.token;
        } catch (e) {
            throw new AuthenticationError(e.response.status, e.response.data.message);
        }
    },*/
    authRequest: async function (url, creditentials) { 
        const requestData = {
            method: 'post',
            url,
            data: creditentials
        }
        try {
            const response = await ApiService.customRequest(requestData);
            TokenService.saveToken(response.data.token);
            return response.data.token;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message);
        }
    },
    logout: async function () {
        TokenService.removeToken();
    }
}

export default UserService;

export { UserService, AuthenticationError};