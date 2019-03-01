const monk = require('monk');
const db = monk('mongodb://lele:lele1lele2@vosticchat-shard-00-00-boshe.mongodb.net:27017,vosticchat-shard-00-01-boshe.mongodb.net:27017,vosticchat-shard-00-02-boshe.mongodb.net:27017/chat?ssl=true&replicaSet=VosticChat-shard-0&authSource=admin&retryWrites=true');
db.then(() => {
    console.log('Connected correctly to server')
})

module.exports = db;