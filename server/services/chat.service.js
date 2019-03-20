const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const chats = db.get('rooms');
const users = db.get('users');
const messages = db.get('messages');

const getDirectChatData = (currentUserId, chat) => {
    chat.participentsDATA.forEach(participent => {
        if (participent._id.toString() !== currentUserId) {
            chat.name = participent.username;
            chat.avatar = participent.avatar;
        }
    });
    return chat;
}

const chatService = {
    refreshChats(userData) {
        return new Promise((resolve, reject) => {
            const currentUserId = userData._id;
            chats.find({ participents: currentUserId }).then(allChats => {
                allChats.map(chat => {
                    //if its not a group then get the other contact avatar and username
                    if (!chat.group) {
                        return chat = getDirectChatData(currentUserId, chat);
                    }
                });
                userData.chats = allChats;
                resolve(userData);
            }).catch(error => {
                console.log(error);
                reject(error)
                //sendError(res, 500, 'Problem connecting to server', next);
            });
        })
    },
    getDirectChat(participents) {
        return new Promise((resolve, reject) => {
            const userId = participents.userId;
            const contactId = participents.contactId;
            //return the direct conntact chat
            const chatParticipents = [userId, contactId]
            chats.findOne({ participents: { $all: chatParticipents }, group: false })
                .then(chat => {
                    if (chat) {
                        //get chat messages
                        messages.findOne({ chatId: chat._id.toString() }, { _id: 0, chatId: 0 }).then(chatMessages => {
                            let messages;
                            chatMessages ? messages = chatMessages.messages : messages = [];
                            const chatData = {
                                messages,
                                chatId: chat._id
                            }
                            resolve(chatData);
                        })
                    } else {
                        //create the chat
                        users.find({ _id: { $in: chatParticipents } }, { username: 1, avatar: 1 }).then(usersData => {
                            chats.insert({
                                created_at: Date.now(),
                                group: false,
                                participents: chatParticipents,
                                //set the display data for each user
                                participentsDATA: usersData
                            }).then(chat => {
                                const chatData = {
                                    newChat: true,
                                    messages: [],
                                    chatId: chat._id.toString()
                                }
                                resolve(chatData);
                            }).catch(error => {
                                console.log(error);
                                reject(error);
                            })
                        })

                    }
                })
        })
    },
    getChatData(currentUserId, chatId) {
        return new Promise((resolve, reject) => {
            chats.findOne({ _id: chatId }).then(chat => {
                if (chat) {
                    if (!chat.group) {
                        chatData = getDirectChatData(currentUserId, chat);
                        console.log(chatData)
                        resolve(chatData);
                    }
                    resolve(chat);
                } else {
                    reject();
                }

            })
        })
    },
    getChatMessages(chatId) {
        return new Promise((resolve, reject) => {
            messages.findOne({ chatId }).then(chatMessages => {
                let messages;
                chatMessages ? messages = chatMessages.messages : messages = [];
                const chatData = {
                    messages,
                    chatId
                }
                resolve(chatData);
            })
        })
    },
    removeChat() {
        const chatId = chatId;
        messages.remove({ chatId });
        chats.remove({ _id: chatId }).then(() => {
            next();
        });

    },
    saveMessage(data) {
        return new Promise((resolve, reject) => {
            const message = data.message;
            const chatId = data.chatId;
            messages.findOne({ chatId }).then(chatMessages => {
                if (!chatMessages) {
                    //create a new message document for the current chat
                    messages.insert({
                        chatId,
                        messages: [message]
                    });
                } else {
                    messages.findOneAndUpdate({ chatId }, { $push: { messages: message } });
                }
            });
        });

    }
}

module.exports = chatService;