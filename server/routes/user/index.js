/*const express = require('express');
const db = require('../../db/connection.js');
const verify = require('../../middlewears/verify');
const sendError = require('../../helpers/errorHandeler');
const users = db.get('users');
const chats = db.get('rooms');
const messages = db.get('messages');
const avatars = db.get('avatars');
const router = express.Router();


const applicationStatics = {
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

const contactService = {
    refreshContacts: (req, res, next) => {
        const userData = req.userData;
        users.find({ _id: { $in: userData.contactRequests } }, { username: 1, avatar: 1 }).then(contactRequest => {
            req.userData.contactRequests = contactRequest;
            users.find({ _id: { $in: userData.contacts } }, { username: 1, avatar: 1 }).then(contacts => {
                req.userData.contactsData = contacts;
                return userData;
            }).catch(error => {
                sendError(res, 500, 'Problem connecting to server', next);
            });
        }).catch(error => {
            console.log(error)
        });

    },
    getContact: (req, res, next) => {
        console.log('gettingcontact');
        const contactId = req.body.contactId.toString();
        users.findOne({ _id: contactId }, { username: 1, avatar: 1 }).then(contact => {
            console.log(contact)
            res.send(contact);
        })
    },
    addContact: (req, res, next) => {
        const currentUser = req.userData;
        const currentUserId = currentUser._id.toString();
        const contactId = req.body.data.contactId.toString();
        if (req.body.data.fromRequest) {
            users.findOneAndUpdate({ _id: currentUserId }, { $pull: { contactRequests: contactId }, $push: { contacts: contactId } })
                .then(updatedUser => {
                    console.log(updatedUser.contactRequests)
                    req.userData.contactRequests = updatedUser.contactRequests;
                    req.userData.contacts = updatedUser.contacts
                    next();
                })
        } else {
            users.findOneAndUpdate({ _id: currentUserId }, { $push: { contacts: contactId } })
                .then(updatedUser => {
                    users.findOne({ _id: contactId }, { avatar: 1, username: 1, contactRequests: 1, contacts: 1 })
                        .then(contact => {
                            if (contact.contactRequests.indexOf(currentUserId) < 0 && contact.contacts.indexOf(currentUserId) < 0) {
                                users.update({ _id: contactId }, { $push: { contactRequests: currentUserId } })
                            }
                            req.userData.contacts = updatedUser.contacts;
                            req.userData.notification = {
                                msg: 'Contact request sent to ' + contact.username,
                                type: 'info'
                            }
                            delete contact.contactRequests;
                            req.userData.contact = contact;
                            console.log('lele i ovde')
                            next();
                        })
                }).catch(error => {
                    sendError(res, 409, 'That user does not exist', next);
                });
        }
    },
    removeContact: (req, res, next) => {
        const userData = req.userData;
        const contactIdPosition = userData.contacts.indexOf(req.body.contactId);
        userData.contacts.splice(contactIdPosition, 1);
        users.findOneAndUpdate({ username: userData.username }, { $set: { contacts: userData.contacts } })
            .then(updatedUser => {
                console.log(updatedUser)
                req.userData.contacts = updatedUser.contacts;
                next();
            }).catch(error => {
                sendError(res, 409, 'That user does not exist', next);
            });
    }
}
const chatService = {
    refreshChats: (req, res, next) => {
        const currentUserId = req.userData._id.toString();
        chats.find({ participents: currentUserId }).then(allChats => {
            allChats.map(chat => {
                if (!chat.group) {
                    const chatData = chat.participentsDATA[currentUserId];
                    chat.avatar = chatData.chatAvatar;
                    chat.name = chatData.chatName;
                }
            });
            //find a way to query object
            req.userData.chats = allChats;
            next();
        }).catch(error => {
            console.log(error);
            sendError(res, 500, 'Problem connecting to server', next);
        });
    },
    viewChat: (req, res, next) => {
        const currentUser = req.userData;
        const currentUserId = currentUser._id.toString();
        const chatData = req.body.data;
        if (chatData.direct) {
            //return the direct conntact chat
            const otherUser = chatData.contact;
            const chatParticipents = [currentUserId, otherUser._id]
            chats.findOne({ participents: { $all: chatParticipents }, group: false })
                .then(chat => {
                    if (chat) {
                        //send chat data
                        messages.findOne({ chatId: chat._id.toString() }, { _id: 0, chatId: 0 }).then(chatMessages => {
                            let messages;
                            chatMessages ? messages = chatMessages.messages : messages = [];
                            const chatData = {
                                messages,
                                chatId: chat._id
                            }
                            res.send(chatData);
                        })
                    } else {
                        //create the chat and then send chat data
                        chats.insert({
                            created_at: Date.now(),
                            group: false,
                            participents: chatParticipents,
                            //set the display data for each user
                            participentsDATA: {
                                [currentUserId]: {
                                    //chat name for this user is the username of the other user 
                                    chatName: otherUser.username,
                                    chatAvatar: otherUser.avatar,
                                },
                                [otherUser._id]: {
                                    userId: otherUser._id,
                                    chatName: currentUser.username,
                                    chatAvatar: currentUser.avatar,
                                }
                            }
                        }).then(chat => {
                            req.userData.messages = [];
                            req.userData.chatId = chat._id;
                            next();
                        }).catch(error => {
                            console.log(error);
                            sendError(res, 500, 'Problem connecting to server', next);
                        })
                    }
                })
        } else {
            //return chat by chatId
            chats.findOne({ _id: chatData._id }).then(chat => {
                if (chat) {
                    messages.findOne({ chatId: chat._id.toString() }).then(chatMessages => {
                        let messages;
                        chatMessages ? messages = chatMessages.messages : messages = [];
                        const chatData = {
                            messages,
                            chatId: chat._id
                        }
                        res.send(chatData);
                    })
                }
            })
        }
    },
    removeChat: (req, res, next) => {
        const chatId = req.body.chatId;
        messages.remove({ chatId });
        chats.remove({ _id: chatId }).then(() => {
            next();
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
    res.send(req.userData);
}

router.get('/avatars', applicationStatics.avatarData, sendData);


module.exports = router;
module.exports = {contactService, chatService};*/