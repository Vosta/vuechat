import axios from 'axios';
import { TokenService } from './storage.service'

//const LOGIN_URL = 
//const SIGNUP_URL = 

const ApiService = {
    LOGIN_URL: 'http://localhost:5000/auth/login',
    SIGNUP_URL: 'http://localhost:5000/auth/signup',
    INFO_URL: 'http://localhost:5000/user',
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
