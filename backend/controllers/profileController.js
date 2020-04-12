const db = require("../services/dbservice");
const config = require('config');
const {sendFileOption, defaultAvatarOption} = require("../config/multerconfig");
const fs = require('fs');
const logger = require('../config/loggerconfig');
const {redisClient} = require('../services/redisservice');

const REDIS_AVATAR_EXPIRE_TIME = config.get("redis.avatar_maxAge");

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

    let avatar_key = username + "/avatar";
    let avatar_type_key = avatar_key + "/mime";

    redisClient.mget(avatar_key, avatar_type_key, function (err, avatar) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (avatar[0]) {
            redisClient.expire(avatar_key, REDIS_AVATAR_EXPIRE_TIME);
            res.setHeader('Content-Type', avatar[1]);
            let image_buffer = Buffer.from(avatar[0], 'base64');
            res.send(image_buffer);
        } else {
            db.users.findOne({_id: username}, function(err, user) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({error: err});
                }
                let file_type, avatar_path;

                // If there is no avatar uploaded
                if (!user.avatar.path) {
                    file_type = config.get("avatar.default_mimetype");
                    avatar_path = config.get("avatar.default_filePath");
                } else {
                    file_type = user.avatar.mimetype;
                    avatar_path = user.avatar.path;
                }

                let fileStream = fs.createReadStream(avatar_path);
                let chunks = [];

                fileStream.on('data', (chunk) => {
                    chunks.push(chunk); // push data chunk to array
                });

                fileStream.once('end', () => {
                    // create the final data Buffer from data chunks;
                    let fileBuffer = Buffer.concat(chunks);
                    redisClient.setex(avatar_key, REDIS_AVATAR_EXPIRE_TIME, fileBuffer.toString('base64'));
                    redisClient.setex(avatar_type_key, REDIS_AVATAR_EXPIRE_TIME, file_type);
                    res.setHeader('Content-Type', file_type);
                    res.send(fileBuffer);
                });
            });
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

    let avatar_key = username + "/avatar";
    let avatar_type_key = avatar_key + "/mime";

    db.users.findOne({_id: username}, {avatar: 1}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (!user) return res.status(404).json({error: "User Not Find"});
        if (user.avatar.path) {
            fs.unlink(user.avatar.path, (err) => {
                if (err) return res.status(500).json({error: "Unable to delete the file"});
            });
        }
        db.users.updateOne({_id: username}, {$set: {avatar: image}}, function(err, _) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            // Remove Keys
            redisClient.del(avatar_key);
            redisClient.del(avatar_type_key);
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
 *      -X PUT \
 *      -d '{"descriptor": [0.1, .... , 0.2323]} \
 *      localhost:5000/api/profile/facedata
 *
 * @apiHeader {String} Content-Type Must be `application/json`.
 *
 * @apiParam  {float[]} descriptor The array of the face descriptors.
 *
 * @apiSuccessExample {empty} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError (Error 400) BadFormat title/description/pictures has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.updateFaceData = function (req, res, next) {
    let descriptor = req.body.descriptor;
    let temp = [];
    for (let i=0; i < 128; i++){
        temp.push(descriptor[i.toString()]);
    }

    db.users.updateOne({_id: req.session.username},{$set: {descriptor: temp} } , function (err, data) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        else return res.status(200).end();
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
            return res.status(500).json({error: err});
        }
        if (!user) return res.status(404).json({error: "User not Find"});
        return res.json(user);
    })
};
