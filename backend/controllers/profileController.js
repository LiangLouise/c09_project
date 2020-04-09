const db = require("../services/dbservice");
const config = require('config');
const {sendFileOption, defaultAvatarOption} = require("../config/multerconfig");
const fs = require('fs');
const faceData = require('../model/faceData');
const logger = require('../config/loggerconfig');

/**
 * @api {get} /api/profile/avatar?username=:username Get the avatar of the user
 * @apiName Get the user's avatar
 * @apiGroup Posts
 * @apiDescription Get the avatar of the user by their's id, if success, a image file will be sent.
 *      Otherwise, response is error message with corresponding error message.
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/profile/avatar?username=alice
 *
 * @apiParam (Request Query) {String} username The unique id of the avatar's owner
 *
 * @apiSuccess {BinaryFile} image The binary of the image file, the format `Content-Type` is in response header.
 *
 * @apiSuccessExample {BinaryFile} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: images/jpeg
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the user in the query.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getAvatar = function (req, res, next) {
    let username = req.query.username;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        // If there is no avatar uploaded
        if (!user.avatar.path) {
            res.setHeader('Content-Type', config.get("avatar.default_mimetype"));
            res.sendFile(config.get("avatar.default_filePath"), defaultAvatarOption);
        } else {
            res.setHeader('Content-Type', user.avatar.mimeType);
            res.sendFile(user.avatar.path, sendFileOption());
        }
    });
};

exports.updateAvatar = function (req, res, next) {
    let username = req.session.username;
    let image = req.file;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(404).end();
        fs.unlink(user.avatar.path, (err) => {
            if (err) return res.status(500).end("Unable to delete the file");
        });
        db.users.update({_id: username}, {$set: {avatar: image}}, function(err, _) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.status(200).end();
        });
    });
};

exports.updateFaceData = function (req, res, next) {
    let userName = req.session.username;
    let data = req.body.facedata;
    db.facedata.update(new faceData(userName, data), {upsert: true}, function (err, data) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        else return res.status(200).end();
    });
};

exports.getFaceData = function (req, res, next) {
    let userName = req.session.username;
    db.facedata.findOne({_id: userName}, function (err, facedata) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!facedata) return res.json({data: {}});
        return res.json({data: facedata.data});
    });
};

exports.getUserProfile = function (req, res, next) {
    let username = req.query.username;
    db.users.findOne({_id: username}, {salt: 0, hash: 0, avatar:0}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(404).end();
        return res.json(user);
    })
};