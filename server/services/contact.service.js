const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const users = db.get('users');

const contactService = {
    refreshContacts(userData) {
        return new Promise((resolve, reject) => {
            users.find({ _id: { $in: userData.contactRequests } }, { username: 1, avatar: 1 }).then(contactRequests => {
                userData.contactRequests = contactRequests;
                users.find({ _id: { $in: userData.contactPendings } }, { username: 1, avatar: 1 }).then(contactPendings => {
                    userData.contactPendings = contactPendings;
                    users.find({ _id: { $in: userData.contacts } }, { username: 1, avatar: 1 }).then(contacts => {
                        userData.contactsData = contacts;
                        resolve(userData);
                    }).catch(error => {
                        reject(error);//sendError(res, 500, 'Problem connecting to server', next);
                    });
                });
            }).catch(error => {
                console.log(error);
                reject(error)
            });
        })
    },
    addContact(currentUserId, contactId) {
        return new Promise((resolve, reject) => {
            let response = {};
            users.findOneAndUpdate({ _id: currentUserId, contactPendings: { $ne: contactId } },
                { $push: { contactPendings: contactId } },
                { avatar: 1, username: 1 })
                .then(user => {
                    response.contactRequest = user;
                    users.findOneAndUpdate({ _id: contactId, contactRequests: { $ne: contactId }, contacts: { $ne: contactId } },
                        { $push: { contactRequests: currentUserId } }, { avatar: 1, username: 1 })
                        .then(contact => {
                            response.contactPending = contact;
                            resolve(response);
                        })
                }).catch(error => {
                    reject(error);
                    console.log(error)
                    //sendError(res, 409, 'That user does not exist', next);
                });
        });
    },
    acceptContact(currentUserId, contactId) {
        return new Promise((resolve, reject) => {
            let response = {};
            users.findOneAndUpdate({ _id: currentUserId },
                { $push: { contacts: contactId }, $pull: { contactRequests: contactId } },
                { avatar: 1, username: 1 })
                .then(user => {
                    //set user status active
                    user.active = true;
                    response.currentUser = user;
                    users.findOneAndUpdate({ _id: contactId },
                        { $push: { contacts: currentUserId }, $pull: { contactPendings: currentUserId } },
                        { avatar: 1, username: 1 })
                        .then(contact => {
                            response.contact = contact;
                            resolve(response);
                        })
                }).catch(error => {
                    reject(error);
                    console.log(error)
                    //sendError(res, 409, 'That user does not exist', next);
                });
        })
    },
    removeRequest(userId, contactId) {
        return new Promise((resolve, reject) => {
            users.findOneAndUpdate({ _id: userId }, { $pull: { contactPendings: contactId } }).then(user => {
                if (user) 
                    resolve();
                else 
                    reject();
            })
        })
    },
    removeContact(userId, contactId) {
        return new Promise((resolve, reject) => {
            console.log(userId)
            users.findOneAndUpdate({ _id: userId }, { $pull: { contacts: contactId } }, { contacts: 1 }).then(userContacts => {
                resolve(userContacts);
            })
        })

    },
    getContact() {
        console.log('gettingcontact');
        const contactId = contactId.toString();
        users.findOne({ _id: contactId }, { username: 1, avatar: 1 }).then(contact => {
            console.log(contact)
            send(contact);
        })
    },
}

module.exports = contactService;