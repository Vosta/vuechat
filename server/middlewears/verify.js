const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const users = db.get('users');

const auth = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject('Your login seassion has expired, please login again.');
            }
            else {
                users.findOne({
                    username: decoded.username
                }, { username: 1, avatar: 1, contacts: 1, contactRequests: 1, contactPendings: 1 })
                    .then(async user => {
                        if (user) {
                            user._id = user._id.toString();
                            resolve(user);
                        } else {
                            console.log(err);
                            reject('User that matches the token wasn\'t found.');
                        }

                    })
            }
        })
    })
}

module.exports = auth;