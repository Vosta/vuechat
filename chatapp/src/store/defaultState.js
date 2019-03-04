
import { TokenService } from '../services/storage.service';
const state = {
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
        contacts: []
    },
    search: {
        searchStatus: false,
        searchValue: '',
        searchedData: []
    },
    chat: {
        messages: [{
            content: '',
            by: '',
            date: 0
        }],
        socketId: '',
        chatStatus: false,
        chatId: '',
        chatAvatar: '',
        chatName: ''
    }
}

export default state;