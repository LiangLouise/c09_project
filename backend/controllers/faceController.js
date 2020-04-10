const db = require("../services/dbservice");
const logger = require('../config/loggerconfig');
const faceapi = require('face-api.js');

exports.getPostFaceData = function (req, res, next) {
    let sessionUsername = req.session.username;
    let image_index = req.params.image_index;
    let post_id = req.params.id;

    db.posts.findOne({_id: post_id}, function (err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }

        // Check if the current user is picture owner or the friends
        if (sessionUsername !== post.username) {
            db.users.find({_id: sessionUsername, following_ids: post.username}).count(function(err, count) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({error: err});
                }
                if (count !== 1) return res.status(403).json({error:"Not Friend"});
            });
        }
        res.setHeader('Content-Type', post.pictures[image_index].mimetype);
        res.sendFile(post.pictures[image_index].path, sendFileOption());
    });
};
