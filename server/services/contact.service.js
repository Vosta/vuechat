const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const users = db.get('users');

const contactService = {
    refreshContacts(userData) {
        return new Promise((resolve, reject) => {
            const userContacts = userData.contacts;
            users.find({ _id: { $in: userContacts.requests } }, { username: 1, avatar: 1 }).then(contactRequests => {
                userContacts.requests = contactRequests;
                users.find({ _id: { $in: userContacts.pending } }, { username: 1, avatar: 1 }).then(contactsPending => {
                    userContacts.pending = contactsPending;
                    users.find({ _id: { $in: userContacts.approved } }, { username: 1, avatar: 1 }).then(contacts => {
                        userContacts.approvedData = contacts;
                        //update the main userData object
                        userData.contacts = userContacts;
                        resolve(userData);
                    }).catch(error => {
                        console.log(error)
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
            users.findOneAndUpdate({
                _id: currentUserId, 'contacts.pending': { $ne: contactId },
                'contacts.approved': { $ne: contactId }
            },
                { $push: { 'contacts.pending': contactId } },
                { avatar: 1, username: 1 })
                .then(user => {
                    if (user) {
                        const contactRequest = user;
                        users.findOneAndUpdate({ _id: contactId, 'contacts.requests': { $ne: contactId }, 'contacts.approved': { $ne: contactId } },
                            { $push: { 'contacts.requests': currentUserId } }, { avatar: 1, username: 1 })
                            .then(contactPending => {
                                const response = {
                                    contactRequest,
                                    contactPending
                                }
                                resolve(response);
                            })
                    } else {
                        reject('User not found')
                    }

                }).catch(error => {
                    reject(error);
                    console.log(error)
                    //sendError(res, 409, 'That user does not exist', next);
                });
        });
    },
    acceptContact(currentUserId, contactId) {
        return new Promise((resolve, reject) => {
            users.findOneAndUpdate({ _id: currentUserId },
                { $push: { 'contacts.approved': contactId }, $pull: { 'contacts.requests': contactId } },
                { avatar: 1, username: 1 })
                .then(user => {
                    if (user) {
                        //set user status active
                        user.active = true;
                        const currentUser = user;
                        users.findOneAndUpdate({ _id: contactId },
                            { $push: { 'contacts.approved': currentUserId }, $pull: { 'contacts.pending': currentUserId } },
                            { avatar: 1, username: 1 })
                            .then(contact => {
                                const response = {
                                    currentUser,
                                    contact
                                }
                                resolve(response);
                            })
                    } else {
                        console.log('lele')
                        reject('No user found')
                    }

                }).catch(error => {
                    reject(error);
                    console.log(error)
                    //sendError(res, 409, 'That user does not exist', next);
                });
        })
    },
    removeRequest(userId, contactId) {
        return new Promise((resolve, reject) => {
            users.findOneAndUpdate({ _id: userId }, { $pull: { 'contacts.pending': contactId } }).then(user => {
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
            users.findOneAndUpdate({ _id: userId }, { $pull: { 'contacts.approved': contactId } }, { contacts: 1 }).then(userContacts => {
                if (userContacts)
                    resolve(userContacts);
                else
                    reject();
            })
        })

    },
    getContact() {
        const contactId = contactId.toString();
        users.findOne({ _id: contactId }, { username: 1, avatar: 1 }).then(contact => {
            resolve(contact);
        })
    },
}

module.exports = contactService;