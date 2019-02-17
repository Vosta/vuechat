const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const users = db.get('users');

const router = express.Router();

router.post('/user', (req, res, next) => {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, function (err, decoded) {
        users.findOne({
            username: decoded.username
        }).then(async user => {
            users.aggregate([
                {
                    $unwind: "$chats"
                },
                {
                    $lookup:
                    {
                        from: 'rooms',
                        localField: 'chats',
                        foreignField: 'name',
                        as: "user_chats"
                    }
                },
                {
                    $match: {
                        'username': user.username
                    }
                },
                { $limit: 1 }
            ]).then((result) => {
                let userWithChatData = result[0];
                console.log(userWithChatData.user_chats)
                let loggedUserData = {
                    username: userWithChatData.username,
                    avatar: userWithChatData.avatar,
                    contacts: userWithChatData.contacts,
                    chats: userWithChatData.user_chats
                }
                console.log(loggedUserData)
                res.json(loggedUserData);
             });
            
        })
    });
});

module.exports = router;