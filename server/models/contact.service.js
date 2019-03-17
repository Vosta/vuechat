const db = require('../db/connection.js');
const sendError = require('../helpers/errorHandeler');
const users = db.get('users');


const contactService = {
    refreshContacts(userData) {
        return new Promise((resolve, reject) => {
            users.find({ _id: { $in: userData.contactRequests } }, { username: 1, avatar: 1 }).then(contactRequest => {
                userData.contactRequests = contactRequest;
                users.find({ _id: { $in: userData.contacts } }, { username: 1, avatar: 1 }).then(contacts => {
                    userData.contactsData = contacts;
                    resolve(userData);
                }).catch(error => {
                    reject(error);//sendError(res, 500, 'Problem connecting to server', next);
                });
            }).catch(error => {
                reject(error)
            });
        })
    },
    addContact(data) {
        const currentUserId = userData._id.toString();
        const contactId = data.contactId.toString();
        if (data.fromRequest) {
            users.findOneAndUpdate({ _id: currentUserId }, { $pull: { contactRequests: contactId }, $push: { contacts: contactId } })
                .then(updatedUser => {
                    console.log(updatedUser.contactRequests)
                    userData.contactRequests = updatedUser.contactRequests;
                    userData.contacts = updatedUser.contacts
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
                            userData.contacts = updatedUser.contacts;
                            userData.notification = {
                                msg: 'Contact request sent to ' + contact.username,
                                type: 'info'
                            }
                            delete contact.contactRequests;
                            userData.contact = contact;
                            console.log('lele i ovde')
                            next();
                        })
                }).catch(error => {
                    sendError(res, 409, 'That user does not exist', next);
                });
        }
    },
    removeContact(userData) {
        const contactIdPosition = userData.contacts.indexOf(contactId);
        userData.contacts.splice(contactIdPosition, 1);
        users.findOneAndUpdate({ username: userData.username }, { $set: { contacts: userData.contacts } })
            .then(updatedUser => {
                console.log(updatedUser)
                userData.contacts = updatedUser.contacts;
                next();
            }).catch(error => {
                sendError(res, 409, 'That user does not exist', next);
            });
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