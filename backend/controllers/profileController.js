const db = require("../services/dbservice");
const config = require('config');
const {sendFileOption, defaultAvatarOption} = require("../config/multerconfig");
const fs = require('fs');
const faceData = require('../model/faceData');
const logger = require('../config/loggerconfig');

/**
 * @api {get} /api/profile/avatar?username=:username Get the avatar of the user
 * @apiName Get the user's avatar
 * @apiGroup Profile
 * @apiDescription Get the avatar of the user by their's id, if success, a image file will be sent.
 *      Otherwise, response is error message with corresponding error message.
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/profile/avatar?username=alice
 *
 * @apiParam (Request Query) {String} username The unique id of the avatar's owner, must be Alphanumeric.
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

/**
 * @api {post} /api/profile/avatar Update the User Avatar
 * @apiName Update User Avatar
 * @apiGroup Profile
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt -F "avatar=@new_avatar.jpg" localhost:5000api/profile/avatar
 *
 * @apiParam (Form Data) {File} avatar An image as the new avatar, accepted Format: `.jpeg/.jpg/.png/.gif`
 *
 * @apiSuccess {json} success Uploaded Successfully.
 *
 * @apiSuccessExample {BinaryFile} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *         "success": "Uploaded Successfully!"
 *     }
 *
 * @apiError (Error 400) BadFormat Form Data avatar has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the user to update.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.updateAvatar = function (req, res, next) {
    let username = req.session.username;
    let image = req.file;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end(err);
        }
        if (!user) return res.status(404).end();
        fs.unlink(user.avatar.path, (err) => {
            if (err) return res.status(500).end("Unable to delete the file");
        });
        db.users.update({_id: username}, {$set: {avatar: image}}, function(err, _) {
            if (err) {
                logger.error(err);
                return res.status(500).end(err);
            }
            return res.json({
                success: "Uploaded Successfully!"
            });
        });
    });
};

/**
 * @api {put} /api/profile/facedata Update the user's face descriptors
 * @apiName Update the session user's face descriptors
 * @apiGroup Profile
 * @apiDescription The Session User Uploads a image to log their own face descriptor,
 *      The response is just the status code.
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt \
 *      -c cookie.txt \
 *      -X POST \
 *      -d '{"alice": {"name":"alice", "descriptor":[0.1, .... , 0.2323]} \
 *      localhost:5000/api/profile/facedata
 *
 * @apiHeader {String} Content-Type Must be `application/json`.
 *
 * @apiParam  {Object} data The content of the face descriptors.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError (Error 400) BadFormat title/description/pictures has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.updateFaceData = function (req, res, next) {
    db.facedata.update(new faceData(req), {upsert: true}, function (err, data) {
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

/**
 * @api {get} /api/profile?username=:username Get User Profile
 * @apiName Get User Profile  by Post id
 * @apiGroup Profile
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/profile/?username=alice
 *
 *
 * @apiParam (Request Query) {String} id The unique id of the user, must be Alphanumeric.
 *
 * @apiSuccess {String} _id The unique id of the user.
 * @apiSuccess {String[]} following_ids The list of the username followed by this user
 * @apiSuccess {String[]} follower_ids The list of the username who follows this user
 * @apiSuccess {Integer} post_counts The number of the post created by this user
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "FlyDog",
 *       "following_ids": ["Hello", "Leo123", "bill"],
 *       "follower_ids": ["Keep", "thrree"],
 *       "post_counts": 11,
 *     }
 *
 * @apiError (Error 400) BadFormat Request Query id has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find user with such username
 * @apiError (Error 500) InternalServerError Error from backend.
 */
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