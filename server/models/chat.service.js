const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const chats = db.get('rooms');
const users = db.get('users');
const messages = db.get('messages');

const chatService = {
    leaveRoom() {
        const user = connections[socket.id];
        socket.broadcast.to(socket.room).emit('userEnteredOrLeft', `${user.username} left the chat`);
        socket.leave(socket.room);
    },
    refreshChats(userData) {
        return new Promise((resolve, reject) => {
            const currentUserId = userData._id;
            chats.find({ participents: currentUserId }).then(allChats => {
                allChats.map(chat => {
                    //if its not a group then get the other contact avatar and username
                    if (!chat.group) {
                        for (const participentData of chat.participentsDATA) {
                            if (participentData._id.toString() !== currentUserId) {
                                chat.name = participentData.username;
                                chat.avatar = participentData.avatar;
                                break;
                            }
                        }
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
                        //create the chat and then send chat data
                        users.find({ _id: { $in: chatParticipents } }, { username: 1, avatar: 1 }).then(usersData => {
                            chats.insert({
                                created_at: Date.now(),
                                group: false,
                                participents: chatParticipents,
                                //set the display data for each user
                                participentsDATA: usersData
                            }).then(chat => {
                                const chatData = {
                                    messages: [],
                                    chatId: chat._id.toString()
                                }
                                resolve(chatData);
                            }).catch(error => {
                                console.log(error);
                                reject(error);
                                //sendError(res, 500, 'Problem connecting to server', next);
                            })
                        })

                    }
                })
        })
    },
    getChat(chatId) {
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

/*viewChat() {
        const currentUser = userData;
        const currentUserId = currentUser._id.toString();
        const chatData = data;
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
                            send(chatData);
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
                            userData.messages = [];
                            userData.chatId = chat._id;
                            next();
                        }).catch(error => {
                            console.log(error);
                            //sendError(res, 500, 'Problem connecting to server', next);
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
                        send(chatData);
                    })
                }
            })
        }
    },*/