import axios from 'axios';
import { TokenService } from './storage.service'

//const LOGIN_URL = 
//const SIGNUP_URL = 

const ApiService = {
    LOGIN_URL: 'http://localhost:5000/auth/login',
    SIGNUP_URL: 'http://localhost:5000/auth/signup',
    INFO_URL: 'http://localhost:5000/user',
    SEARCH_URL: 'http://localhost:5000/search',
    ADD_CONTACT_URL: 'http://localhost:5000/add/contact',
    EDIT_CONTACT_URL: 'http://localhost:5000/edit-contact',
    DELETE_CONTACT_URL: 'http://localhost:5000/delete-contact',
    AVATARS_URL: 'http://localhost:5000/avatars',
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
