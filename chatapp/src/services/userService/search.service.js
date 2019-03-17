import { ApiService } from '../api.service';

const SearchService = {
    search: async function (url, searchValue){
        const requestData = {
            method: 'post',
            url: url,
            data: searchValue
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