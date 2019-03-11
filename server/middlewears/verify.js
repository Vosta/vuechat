const jwt = require('jsonwebtoken');
const sendError = require('../helpers/errorHandeler');
const db = require('../db/connection.js');
const users = db.get('users');

var verify = async function (req, res, next) {
    await jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            sendError(res, 401, 'Unauthorized access please login again', next)
        } else {
            users.findOne({
                username: decoded.username
            }, { username: 1, avatar: 1, contacts: 1, contactRequests: 1 })
            .then(async user => {
                console.log(user)
                req.data = {
                    user: user,
                    contacts: user.contacts
                };
                
                next();
            })
        }  
    })
}

module.exports = verify;