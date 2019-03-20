const express = require('express');
const db = require('../../db/connection.js');
const sendError = require('../../helpers/errorHandeler');
const avatars = db.get('avatars');
const router = express.Router();

const applicationStatics = {
    avatarImages: (req, res, next) => {
        avatars.findOne()
            .then(avatarObject => {
                delete avatarObject._id;
                res.send(avatarObject.avatars);
            })
            .catch(() => {
                sendError(res, 500, 'Avatars are temporarely unavailable', next);
            });
    }
}
router.get('/avatars', applicationStatics.avatarImages);


module.exports = router;