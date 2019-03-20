const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const users = db.get('users');


const doSearch = (searchData) => {
    return new Promise((resolve, reject) => {
        if (searchData.type === 'users') {
            users.find({
                username: { $regex: searchData.value, $ne: searchData.currentUser.username, $options: 'i' },
                _id: { $nin: searchData.currentUser.contacts }
            }, { username: 1, avatar: 1 })
                .then(filteredUsers => {
                    resolve(filteredUsers);
                }).catch(error => {
                    reject(error);
                })
        }
    })


}

module.exports = doSearch;