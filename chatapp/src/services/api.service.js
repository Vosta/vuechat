import axios from 'axios';
import { TokenService } from './storage.service'

//const LOGIN_URL = 
//const SIGNUP_URL = 

const ApiService = {
    LOGIN_URL: 'http://localhost:5000/auth/login',
    SIGNUP_URL: 'http://localhost:5000/auth/signup',
    AVATARS_URL: 'http://localhost:5000/user/avatars',
    USER_DATA_URL: 'http://localhost:5000/user/data',
    SEARCH_URL: 'http://localhost:5000/user/search',
    GET_CONTACT_URL: 'http://localhost:5000/user/contact',
    ADD_CONTACT_URL: 'http://localhost:5000/user/contact/add',
    EDIT_CONTACT_URL: 'http://localhost:5000/user/contact/edit',
    REMOVE_CONTACT_URL: 'http://localhost:5000/user/contact/remove',
    CHAT_URL: 'http://localhost:5000/user/chat/view',
    REMOVE_CHAT_URL: 'http://localhost:5000/user/chat/remove',
    MESSAGES_URL: 'http://localhost:5000/user/message',
    
    get(resource){
        return axios.get(resource);
    },
    post(resource, data){
        return axios.post(resource, data);
    },
    customRequest(data){
        return axios(data);
    }
};

export { ApiService };
