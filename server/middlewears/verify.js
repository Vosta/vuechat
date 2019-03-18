const jwt = require('jsonwebtoken');
const sendError = require('../helpers/errorHandeler');
const db = require('../db/connection.js');
const users = db.get('users');

const auth = (token) => {
    console.log(token)
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
                //sendError(res, 401, 'Unauthorized access please login again', next)
            } else {
                users.findOne({
                    username: decoded.username
                }, { username: 1, avatar: 1, contacts: 1, contactRequests: 1, contactPendings: 1 })
                    .then(async user => {
                        user._id = user._id.toString();
                        resolve(user);
                    })
            }
        })
    })
}

module.exports = auth;