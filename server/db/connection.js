const monk = require('monk');
const db = monk('localhost/chat');

module.exports = db;