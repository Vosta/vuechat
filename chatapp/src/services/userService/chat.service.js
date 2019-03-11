import { TokenService } from '../storage.service';
import { ApiService } from '../api.service';

const ChatService = {
    chatRequest: async function (url, token, data){
        const requestData = {
            method: 'post',
            url: url,
            data: { token, data }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
        
        }
    },
    sendMessage: async function(url, token, messageData) {
        const requestData = {
            method: 'post',
            url: url,
            data: { token, messageData }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
        
        }
    },
}

export default ChatService;

export { ChatService, AuthenticationError};