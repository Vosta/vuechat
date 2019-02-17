const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().trim().min(3).required(),
})

router.get('/', (req, res) => {
    res.send({
        message: 'signup'
    })
});

function sendError(res, status, message, next) {
    const error = new Error(message);
    res.status(status);
    next(error);
}
function generateToken(user, res) {
    const payload = {
        _id: user._id,
        username: user.username
    }
    jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) {
            sendError(res, 422, 'Unable to log in.', next);
        } else {
            res.json({ token });
        };
    });
}

router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        //check if username is unique
        users.findOne({
            username: req.body.username
        }).then(user => {
            //if username exists send an error back
            if (user) {
                sendError(res, 409, 'That username already exists. Please choose another one.', next)
            } else {
                //if it doesn't exist hash the password and add the user to the db
                bcrypt.hash(req.body.password, 10).then(hashPassword => {
                    users.insert(newUser).then(user => {
                        generateToken(user, res);
                    });
                });
            }
        })
    } else {
        sendError(res, 406, 'Invalid username or password', next);
    }
});

router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    console.log(req.body)
    if (result.error === null) {
        users.findOne({
            username: req.body.username
        }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result) {
                            console.log(user._id);
                            generateToken(user, res);
                        } else {
                            sendError(res, 422, 'Wrong username or password.', next);
                        }
                    })
            } else {
                sendError(res, 422, 'That username doesn\'t exist.', next);
            }
        })
    } else {
        sendError(res, 406, 'Invalid username or password', next);
    }
});

router.post('/home', (req, res, next) => {
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