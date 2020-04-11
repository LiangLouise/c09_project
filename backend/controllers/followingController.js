const db = require("../services/dbservice");
const logger = require('../config/loggerconfig');
const config = require('config');

const MAX_COMMENT_LENGTH = config.get('following.MAX_USER_PER_PAGE');

/**
 * @api {POST} /api/follow/ Follow a User
 * @apiName Follow a User
 * @apiGroup Follow
 *
 * @apiExample {curl} Example Usage:
 *  curl -H "Content-Type: application/json" \
 *      -X POST \
 *      -d '{"username":"Bob"}' \
 *      -b cookie.txt \
 *      -c cookie.txt \
 *      localhost:5000/api/follow/
 *
 * @apiHeader {String} Content-Type Must be `application/json`.
 *
 * @apiParam (Request Body) {String} username User's unique ID.
 *
 * @apiSuccess {String} success Mark the operation success.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": "You now followed CledDS"
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumericor or input is the userself.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the corresponding User.
 * @apiError (Error 409) NotFind Already Follow.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.followUser = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    // Get friend name from req body
    let userToFollow = req.body.username;
    // Find Two users
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (!user) return res.status(404).json({error: "User not Find"});
        db.users.findOne({_id: userToFollow}, function (err, goal) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            if (!goal) return res.status(404).json({error: "User to follow Not Find"});
            if (goal.follower_ids.indexOf(username) !== -1
                && user.following_ids.indexOf(userToFollow) !== -1) return res.status(409).end("Already following");
            try {
                db.users.update({_id: username}, {$addToSet: {following_ids: userToFollow}});
                db.users.update({_id: userToFollow}, {$addToSet: {follower_ids: username}});
            } catch (e) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.status(200).json({success: "You now followed " + userToFollow});
        });
    });
};

/**
 * @api {DELETE} /api/follow/:username/ Unfollow a User By username
 * @apiName Unfollow a User
 * @apiGroup Follow
 *
 * @apiExample {curl} Example Usage:
 *  curl -X DELETE \
 *      -b cookie.txt \
 *      -c cookie.txt \
 *      localhost:5000/api/follow/pUALL/
 *
 * @apiParam (Request Body) {String} username User's unique ID.
 *
 * @apiSuccess {String} success Mark the operation success.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": "You now unfollowed house"
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumeric or input is the userself.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the corresponding User.
 * @apiError (Error 409) NotFind Already Unfollow.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.unfollowUser = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    // Get friend name from req body
    let userToUnfollow = req.params.username;
    // Find Two users
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (!user) return res.status(404).json({error: "User not Find"});
        db.users.findOne({_id: userToUnfollow}, function (err, goal) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            if (!goal) return res.status(404).json({error: "User to unfollow not Find"});
            if (goal.follower_ids.indexOf(username) === -1
                && user.following_ids.indexOf(userToUnfollow) === -1) return res.status(409).json({error: "Already Not following"});
            try {
                db.users.update({_id: username}, {$pull: {following_ids: userToUnfollow}});
                db.users.update({_id: userToUnfollow}, {$pull: {follower_ids: username}});
            } catch (e) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.status(200).json({success: "You now unfollowed " + userToUnfollow});
        });
    });
};

 /**
 * @api {get} /api/follow/?page=:page Get Following List By Page
 * @apiName Get Following List By Page
 * @apiGroup Follow
 *
 * @apiExample {curl} Example Usage:
 *  curl -X GET \
 *      -b cookie.txt \
 *      -c cookie.txt \
 *      localhost:5000/api/follow/?page=0
 *
 * @apiParam (Request Query) {Integer} page The Page number of the following to display, each page has at most `10` users
 *
 * @apiSuccess {String[]} users Array of the user ids.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "users": ["Fix", "noBug", "someone"]
 *     }
 *
 * @apiError (Error 400) BadFormat page is not a integer >= 0.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getFollowingList = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let page = req.query.page;
    db.users.findOne(
            {_id: username},
            {following_ids: 1 , following_ids: {$slice: [MAX_COMMENT_LENGTH*page, MAX_COMMENT_LENGTH]}},
            function(err, user) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.status(200).json({users: user.following_ids});
    });
};

/**
 * @api {get} /api/follow/isfollowing/?username=:username Check if following User
 * @apiName Check if the session User is folloing the user in query.
 * @apiGroup Follow
 *
 * @apiExample {curl} Example Usage:
 *  curl -X GET \
 *      -b cookie.txt \
 *      -c cookie.txt \
 *      localhost:5000/api/follow/isfollowing/?username=roy
 *
 * @apiParam (Request Query) {String} username User's unique ID.
 *
 * @apiSuccess {Boolean} isFollowing Mark if the user is following the user in query
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "isFollowing": true
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumericor or input is the userself.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the corresponding User.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.isFollowing = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let friendName = req.query.username;
    db.users.find({_id: username, following_ids: friendName}).count(function(err, count) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (count === 1) return res.status(200).json({isFollowing: true});
        else return res.status(200).json({isFollowing: false});
    })
};

/**
* @api {get} /api/follow/followers/?page=:page Get Follower List By Page
* @apiName Get Follower List by Page
* @apiGroup Follow
*
* @apiExample {curl} Example Usage:
*  curl -X GET \
*      -b cookie.txt \
*      -c cookie.txt \
*      localhost:5000/api/follow/followers/?page=0
*
* @apiParam (Request Query) {Integer} page The Page number of the following to display, each page has at most `10` users
*
* @apiSuccess {String[]} users Array of the user ids.
*
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
*     Content-Type: application/json
*     {
*       "users": ["Fix", "boole", "macOs"]
*     }
*
* @apiError (Error 400) BadFormat page is not a integer >= 0.
* @apiError (Error 401) AccessDeny Not Log In.
* @apiError (Error 500) InternalServerError Error from backend.
*/
exports.getFollowerList = function (req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let page = req.query.page;
    db.users.findOne(
        {_id: username},
        {follower_ids: 1 , follower_ids: {$slice: [10*page, 10]}},
        function(err, user) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.status(200).json({users: user.follower_ids});
        });
};

/**
 * @api {get} /api/follow/isfollowed/?username=:username Check if being followed by User
 * @apiName Check if the session User is following by the user in query.
 * @apiGroup Follow
 *
 * @apiExample {curl} Example Usage:
 *  curl -X GET \
 *      -b cookie.txt \
 *      -c cookie.txt \
 *      localhost:5000/api/follow/isfollowed/?username=simmon
 *
 * @apiParam (Request Query) {String} username User's unique ID.
 *
 * @apiSuccess {Boolean} isFollowing Mark if the user is followed by the user in query
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "isFollowing": false
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumericor or input is the userself.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 404) NotFind Not find the corresponding User.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.isFollowedBy = function (req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let friendName = req.query.username;
    db.users.find({_id: username, follower_ids: friendName}).count(function(err, count) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (count === 1) return res.status(200).json({isFollowed: true});
        else return res.status(200).json({isFollowed: false});
    });
};
