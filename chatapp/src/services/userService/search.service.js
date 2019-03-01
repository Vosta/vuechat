import { TokenService } from '../storage.service';
import { ApiService } from '../api.service';

const SearchService = {
    searchData: async function (url, token, searchValue){
        const requestData = {
            method: 'post',
            url: url,
            data: { token, searchValue }
        }
        try {
            const response = await ApiService.customRequest(requestData);
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.data.message);
        }
    },
}

export default SearchService;

export { SearchService, AuthenticationError};