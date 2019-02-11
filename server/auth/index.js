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
 
router.get('/', (req,res)=>{
    res.send({
        message: 'signup'
    })
});

function sendError(res,status,message,next){
    const error = new Error(message);
    res.status(status);
    next(error);
}

router.post('/signup', (req, res, next)=>{
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        //check if username is unique
        users.findOne({
            username: req.body.username
        }).then(user => {
            //if username exists send an error back
            if (user) {
                sendError(res, 409, 'That username already exists. Please choose another one.', next)
            } else {
            //if it doesn't exist hash the password and add the user to the db
                bcrypt.hash(req.body.password, 10).then(hashPassword =>{
                    const newUser = {
                        username: req.body.username,
                        password: hashPassword
                    };

                    users.insert(newUser).then(user => {
                        delete user.password; //we don't want to send back the password as response
                        res.json(user);
                    });
                });
            }
        })
    }else{
        res.status(406);
        next(result.error);
    }
});

router.post('/login', function(req, res, next){
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        users.findOne({
            username: req.body.username
        }).then(user => {
            if (user){
                bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    if(result){
                        const payload = {
                            _id: user._id,
                            username: user.username
                        }
                        jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: '1d'
                        }, (err, token) => {
                            if(err){
                                sendError(res, 422, 'Unable to log in.', next);
                            } else {
                                res.json({ token });
                            };
                        });
                    } else {
                        sendError(res, 422, 'Wrong username or password.', next);
                    }
                })
            } else {
                sendError(res, 422, 'That username doesn\'t exist.', next);
            }
        })
    }
});
module.exports = router;