const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const users = db.get('users');
const chats = db.get('rooms');
const messages = db.get('messages')
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
    let searchValue = req.body.value;
    console.log(req.body)
    users.findOne({username: req.body.username}).then( user => {
        users.find({ username: { $ne: user.username }}, {username: 1, avatar: 1}).then( allUsers => {
            let filteredUsers = allUsers.filter((foundUser) => {
                if(foundUser.username.includes(searchValue) && !user.contacts.includes(foundUser._id.toString())){
                    return {
                        username: user.username,
                        avatar: user.avatar
                    };
                }
            });
            res.json(filteredUsers);
        });
    })
    
});

module.exports = router;