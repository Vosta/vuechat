const TOKEN_KEY = 'authToken';

const TokenService = {
    getToken(){
        return localStorage.getItem(TOKEN_KEY);
    },
    saveToken(token){
        return localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken(){
        return localStorage.removeItem(TOKEN_KEY)
    }
};

export { TokenService };