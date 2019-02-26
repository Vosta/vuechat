const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const users = db.get('users');
const chats = db.get('rooms');
const messages = db.get('messages');
const avatars = db.get('avatars');
const router = express.Router();

function verify(req, res, next) {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, function (err, decoded) {
        users.findOne({
            username: decoded.username
        }, { username: 1, avatar: 1, contacts: 1 }).then(async user => {
            req.data = {
                user: user,
                contacts: []
            };
            next();
        })
    });
}
function getAvatars(req, res, next) {
    avatars.findOne({}, { avatars: 1 }).then(avatarObject => {
        req.data = avatarObject.avatars;
        next();
    });
}
function refreshContacts(req, res, next) {
    const userData = req.data.user;
    users.find({ _id: { $in: userData.contacts } }, { username: 1, avatar: 1 }).then(contacts => {
        req.data.contacts = contacts;
        next();
    });
}
function addContacts(req, res, next) {
    const curentUser = req.data.user;
    const contactUsername = req.body.username;
    console.log(contactUsername)
    users.findOne({ username: contactUsername }).then(foundContact => {
        users.findOneAndUpdate({ username: curentUser.username }, { $push: { contacts: foundContact._id.toString() } })
            .then(updatedUser => {
                req.data.user.contacts = updatedUser.contacts
                next();
            })
    });
}
function removeContact(req, res, next) {
    const userData = req.data.user;
    const contactIdPosition = userData.contacts.indexOf(req.body.contactId);
    userData.contacts.splice(contactIdPosition, 1);
    users.findOneAndUpdate({ username: userData.username }, { $set: { contacts: userData.contacts } })
        .then(updatedUser => {
            req.data.user = updatedUser;
            next();
        })
}

function viewChat(req, res, next) {
    const userData = req.data.user;
    const chatParticipents = [userData._id.toString(), req.body.contactId]
    chats.findOne({ participents: { $all: chatParticipents } }).then(chat => {
        if (chat) {
            //get chat data
            let chatId = chat._id.toString();
            messages.findOne({ chatId: chat._id.toString() }, { _id: 0, chatId: 0 }).then(chatMessages => {
                if (chatMessages) {
                    console.log(chatMessages)
                    res.send({
                        messages: chatMessages.messages,
                        chatId
                    });
                } else {
                    res.send({
                        messages: [],
                        chatId
                    })
                }

            })
        } else {
            //create new chat
            createChat(chatParticipents, res);

        }
    })
}
function createChat(chatParticipents, res) {
    chats.insert({
        participents: chatParticipents,
        created_at: Date.now()
    }).then(chat => {
        let chatId = chat._id.toString();
        res.send({
            messages: [],
            chatId
        });
    });
}
function saveMessage(req, res, next) {
    let messageData = req.body.messageData;
    messages.findOne({ chatId: messageData.chatId }).then(chatMessages => {
        if (!chatMessages) {
            //create a new message document for the current chat
            messages.insert({
                chatId: messageData.chatId,
                messages: [messageData.message]
            }).then(updatedMessages => {
                res.send({
                    messages: updatedMessages.messages
                });
            });
        } else {
            console.log(messageData.message)
            messages.findOneAndUpdate({ chatId: messageData.chatId }, { $push: { messages: messageData.message } })
                .then(updatedMessages => {
                    res.send({
                        messages: updatedMessages.messages
                    });
                })
        }
    })
}
function sendData(req, res) {
    res.send(req.data);
}
router.post('/user', verify, refreshContacts, sendData);
router.get('/avatars', getAvatars, sendData);

router.post('/add/contact', verify, addContacts, refreshContacts, sendData);

router.post('/remove/contact', verify, removeContact, refreshContacts, sendData)

router.post('/chat/view', verify, viewChat, sendData);

router.post('/message', verify, saveMessage);
router.post('/search', (req, res, next) => {
    const searchValue = req.body.value;
    users.findOne({ username: req.body.username }).then(user => {
        users.find({ username: { $regex: searchValue, $ne: user.username, $options: 'i' }, _id: { $nin: user.contacts } }).then(filteredUsers => {
            res.send(filteredUsers);
        });
    });
});

module.exports = router;