const express = require('express');
const db = require('../../db/connection.js');
const verify = require('../../middlewears/verify');
const sendError = require('../../helpers/errorHandeler');
const users = db.get('users');
const chats = db.get('rooms');
const messages = db.get('messages');
const avatars = db.get('avatars');
const router = express.Router();


var applicationStatics = {
    avatarData: (req, res, next) => {
        avatars.findOne({}, { avatars: 1 })
            .then(avatarObject => {
                req.data = avatarObject.avatars;
                next();
            })
            .catch(error => {
                sendError(res, 500, 'Avatars are temporarely unavailable', next);
            });
    }
}

var contactService = {
    refreshContacts: (req, res, next) => {
        const userData = req.data.user;
        users.find({ _id: { $in: userData.contacts } }, { username: 1, avatar: 1 }).then(contacts => {
            req.data.contacts = contacts;
            next();
        }).catch(error => {
            sendError(res, 500, 'Problem connecting to server', next);
        });
    },
    addContact: (req, res, next) => {
        const curentUser = req.data.user;
        const contactId = req.body.userId;
        users.findOne({ _id: contactId })
            .then(foundContact => {
                users.findOneAndUpdate({ username: curentUser.username }, { $push: { contacts: foundContact._id.toString() } })
                    .then(updatedUser => {
                        req.data.user.contacts = updatedUser.contacts
                        next();
                    })
            }).catch(error => {
                sendError(res, 409, 'That user does not exist', next);
            });
    },
    removeContact: (req, res, next) => {
        const userData = req.data.user;
        const contactIdPosition = userData.contacts.indexOf(req.body.contactId);
        userData.contacts.splice(contactIdPosition, 1);
        users.findOneAndUpdate({ username: userData.username }, { $set: { contacts: userData.contacts } })
            .then(updatedUser => {
                req.data.user = updatedUser;
                next();
            }).catch(error => {
                sendError(res, 409, 'That user does not exist', next);
            });
    }
}
var searchService = {
    searchData: (req, res, next) => {
        const searchValue = req.body.searchValue;
        const currentUser = req.data.user;
        console.log(req.body)
        users.find({ username: { $regex: searchValue, $ne: currentUser.username, $options: 'i' }, _id: { $nin: currentUser.contacts } }).then(filteredUsers => {
            res.send(filteredUsers);
        });
    }
}
var chatService = {
    refreshChats: (req, res, next) => {
        const currentUserId = req.data.user._id.toString();
        chats.find({ participents: currentUserId}).then( chats => {
            req.data.chats = chats;
            next();
        }).catch(error => {
            console.log(error)
            sendError(res, 500, 'Problem connecting to server', next);
        });
    },
    viewChat: (req, res, next) => {
        const currentUser = req.data.user;
        const chatParticipents = [currentUser._id.toString(), req.body.contactId];
        chats.findOne({ participents: { $all: chatParticipents } }).then(chat => {
            if (chat) {
                //get chat data
                let chatId = chat._id.toString();
                messages.findOne({ chatId: chat._id.toString() }, { _id: 0, chatId: 0 }).then(chatMessages => {
                    if (chatMessages) {
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
                chatService.createChat(chatParticipents, res);
            }
        })
    },
    createChat: (chatParticipents, res) => {
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
    },
    saveMessage: (req, res, next) => {
        const messageData = req.body.messageData;
        messages.findOne({ chatId: messageData.chatId }).then(chatMessages => {
            if (!chatMessages) {
                //create a new message document for the current chat
                messages.insert({
                    chatId: messageData.chatId,
                    messages: [messageData.message]
                }).then(() => {
                    res.send({
                        message: messageData.message
                    });
                });
            } else {
                messages.findOneAndUpdate({ chatId: messageData.chatId }, { $push: { messages: messageData.message } })
                    .then(() => {
                        res.send({
                            message: messageData.message
                        });
                    })
            }
        })
    }
}





function sendData(req, res) {
    console.log(req.data);
    res.send(req.data);
}

router.get('/avatars', applicationStatics.avatarData, sendData);

router.post('/data', verify, contactService.refreshContacts, chatService.refreshChats, sendData);

router.post('/contact/add', verify, contactService.addContact, contactService.refreshContacts, sendData);

router.post('/contact/remove', verify, contactService.removeContact, contactService.refreshContacts, sendData);

router.post('/search', verify, searchService.searchData);

router.post('/chat', verify, chatService.viewChat, sendData);

router.post('/message', verify, chatService.saveMessage);



module.exports = router;