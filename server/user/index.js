const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const users = db.get('users');
const chats = db.get('rooms');
const messages = db.get('messages');
const avatars = db.get('avatars');
const router = express.Router();

function verify (req, res, next){
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, function (err, decoded) {
        users.findOne({
            username: decoded.username
        }, {username: 1, avatar: 1, contacts: 1}).then(async user => {
            req.data = {
                user: user,
                contacts: [],
            };
            next();
        })
    });
}
function getAvatars(req, res, next){
    avatars.findOne({ }, {avatars: 1}).then( avatarObject => {
        req.data = avatarObject.avatars;
        next();
    });
}
function refreshContacts(req, res, next){
    const userData = req.data.user;
    users.find({_id: { $in: userData.contacts }}, {username: 1, avatar: 1}).then( contacts => {
        req.data.contacts = contacts;
        next();
    });
}
function sendData(req, res){
    console.log(req.data)
    res.send(req.data);
}

router.post('/user', verify, refreshContacts, sendData);
router.get('/avatars', getAvatars, sendData);
router.post('/add/contact', verify, (req, res, next) => {
    const curentUser = req.data.user;
    const contactUsername = req.body.username;
    console.log(contactUsername)
    users.findOne({ username: contactUsername}).then( foundContact => {
        users.findOneAndUpdate({username: curentUser.username}, {$push: { contacts: foundContact._id.toString()}})
            .then( updatedUser => {
                req.data.user.contacts = updatedUser.contacts 
                next();
            })
    });
    
}, refreshContacts, sendData);


router.post('/search', (req, res, next) => {
    const searchValue = req.body.value;
    users.findOne({username: req.body.username}).then( user => {
        users.find({username: {$regex: searchValue, $ne: user.username, $options : 'i'}, _id: { $nin: user.contacts }}).then( filteredUsers => {
            res.send(filteredUsers);
        });
    });
});

module.exports = router;