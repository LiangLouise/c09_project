const db = require("../services/dbservice");
const logger = require('../config/loggerconfig');


exports.followUser = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    // Get friend name from req body
    let userToFollow = req.body.username;
    // Find Two users
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(404).end("User not Find");
        db.users.findOne({_id: userToFollow}, function (err, goal) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            if (!goal) return res.status(404).end("User to follow Not Find");
            if (goal.follower_ids.indexOf(username) !== -1
                && user.following_ids.indexOf(userToFollow) !== -1) return res.status(409).end("Already following");
            try {
                db.users.update({_id: username}, {$addToSet: {following_ids: userToFollow}});
                db.users.update({_id: userToFollow}, {$addToSet: {follower_ids: username}});
            } catch (e) {
                logger.error(e);
                return res.status(500).end(e);
            }
            return res.status(200).end();
        });
    });
};

exports.unfollowUser = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    // Get friend name from req body
    let userToUnfollow = req.params.username;
    // Find Two users
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(404).end("User not Find");
        db.users.findOne({_id: userToUnfollow}, function (err, goal) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            if (!goal) return res.status(404).end("User to Unfollow Not Find");
            if (goal.follower_ids.indexOf(username) === -1
                && user.following_ids.indexOf(userToUnfollow) === -1) return res.status(409).end("Already Not following");
            try {
                db.users.update({_id: username}, {$pull: {following_ids: userToUnfollow}});
                db.users.update({_id: userToUnfollow}, {$pull: {follower_ids: username}});
            } catch (e) {
                logger.error(e);
                return res.status(500).end(e);
            }
            return res.status(200).end();
        });
    });
};

exports.getFollowingList = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let page = req.query.page;
    db.users.findOne(
            {_id: username},
            {following_ids: 1 , following_ids: {$slice: [10*page, 10]}},
            function(err, user) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.status(200).json({users: user.following_ids});
    });
};

exports.isFollowing = function(req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let friendName = req.query.username;
    db.users.find({_id: username, following_ids: friendName}).count(function(err, count) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (count === 1) return res.status(200).json({isFollowing: true});
        else return res.status(200).json({isFollowing: false});
    })
};

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
                return res.status(500).end();
            }
            return res.status(200).json({users: user.follower_ids});
        });
};

exports.isFollowedBy = function (req, res, next) {
    // Get user name from session
    let username = req.session.username;
    let friendName = req.query.username;
    db.users.find({_id: username, follower_ids: friendName}).count(function(err, count) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (count === 1) return res.status(200).json({isFollowed: true});
        else return res.status(200).json({isFollowed: false});
    });
};