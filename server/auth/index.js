const express = require('express');
const Joi = require('joi'); 
const bcrypt = require('bcryptjs');

const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).required(),
})
 
router.get('/', (req,res)=>{
    res.send({
        message: 'signup'
    })
});

router.post('/signup', (req, res, next)=>{
    console.log(req.body);
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        //username unique
        users.findOne({
            username: req.body.username
        }).then(user => {
            //if undifined username is not in db
            if (user) {
                const error = new Error('That username already exists. Please choose another one');
                next(error);
            } else {
                bcrypt.hash(req.body.password, 10).then(hashPassword =>{
                    const newUser = {
                        username: req.body.username,
                        password: hashPassword
                    };

                    users.insert(newUser).then(user => {
                        res.json(user);
                    });
                });
            }
        })
    }else{
        //send error back to client
        next(result.error);
    }
})
module.exports = router;