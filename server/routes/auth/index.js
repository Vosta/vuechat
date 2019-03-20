const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const sendError = require('../../helpers/errorHandeler');
const db = require('../../db/connection.js');
const users = db.get('users');
const jwt = require('jsonwebtoken');
const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().trim().min(3).required(),
    avatar: Joi.string()
})

const generateToken = (user, res) =>{
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
                bcrypt.hash(req.body.password, 10).then(hashedPassword => {
                    let newUser = {
                        username: req.body.username,
                        password: hashedPassword,
                        avatar: req.body.avatar,
                        contacts: {
                            approved: [],
                            requests: [],
                            pending: []
                        }
                    }
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


module.exports = router;