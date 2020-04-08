const {ObjectId} = require('mongojs');
const db = require("../services/dbservice");
const Post = require("../model/post");
const {sendFileOption} = require("../config/multerconfig");
const fs = require('fs');
const logger = require('../config/loggerconfig');

const MAX_POST_PER_PAGE = 10;

/**
 * @api {post} /api/posts Create a new Post
 * @apiName Create Post
 * @apiGroup Posts
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt -F "title=hello" -F "description=My New Post!" -F "pictures=@hello.jpg" localhost:5000/api/posts
 *
 * @apiHeader {String} Content-Type Must be `multipart/form-data`.
 *
 * @apiParam (Form Data) {String} title Title of the post, no more than `30` chars.
 * @apiParam (Form Data) {Integer} description The content of the post, no more than `200` chars.
 * @apiParam (Form Data) {Image Files} pictures An array of Post pictures, Accepted Format: `.jpeg/.jpg/.png/.gif` and no more than `9` pictures.
 *
 * @apiSuccess {String} _id The id of the post
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "jed5672jd90xfffsdg4wo"
 *     }
 *
 * @apiError (Error 400) BadFormat title/description/pictures has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.createPost = function (req, res, next) {
    let sessionUsername = req.session.username;

    db.posts.insert(new Post(req),
        function (err, item) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            try {
                db.users.update({_id: sessionUsername}, {$inc: {post_counts: 1}});
            } catch (e) {
                logger.error(e);
                return res.status(500).end();
            }
            return res.json({_id: item._id.toString()});
    });
};

exports.deletePostById = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    let sessionUsername = req.session.username;

    db.posts.findOne({_id: post_id}, function(err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!post) return res.status(404).end("Post doesn't exits");
        // Check if the current user is user himself
        if (sessionUsername !== post.username) return res.status(403).end("You are not the owner of the post");
        db.posts.findOne({_id: post_id}, function (err, post) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            for (let pic of post.pictures){
                fs.unlink(pic.path, err => {
                    if (err) return res.status(500).end("Unable to delete the file");
                })
            }
            try {
                // Remove all records related to posts
                db.posts.remove({_id: post_id});
                db.comments.remove({post_id: post_id});
                db.users.update({_id: sessionUsername}, {$inc: {post_counts: -1}});
            } catch (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.status(200).end();
        })
    });
};

exports.getPostById = function (req, res, next) {
    let id = req.params.id;

    db.posts.findOne({_id: ObjectId(id)}, {pictures: 0}, function(err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!post) return res.status(404).end("Post doesn't exits");
        // Check if the current user is user himself or the friends
        if (req.session.username === post.username) return res.json(post);
        else {
            db.users.find({_id: req.session.username, following_ids: post.username}).count(function(err, count) {
                if (err) {
                    logger.error(err);
                    return res.status(500).end();
                }
                if (count !== 1) return res.status(403).end("Not Friend");
                return res.json(post);
            });
        }
    });
};

exports.getPostsByUser = function (req, res, next) {
    let page = req.query.page;
    let sessionUsername = req.query.username;
    let queryUsername = req.query.username;

    // If the query name is not the same as the session user name, then check if they are friends
    if (sessionUsername !== queryUsername) {
        db.users.find({_id: sessionUsername, following_ids: queryUsername}).count(function(err, count) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            if (count !== 1) return res.status(409).end("Not Friend");
        });
    }
    db.posts.find({username: queryUsername}, {pictures: 0}).sort({time: -1})
        .skip(MAX_POST_PER_PAGE * page)
        .limit(MAX_POST_PER_PAGE)
        .toArray(function (err, posts) {
            if(err) return res.status(500).end(err);
            else return res.json(posts);
        });
};

exports.getPostOfFollowing = function (req, res, next) {
    let username = req.session.username;
    let page = req.query.page;

    db.users.findOne({_id: username}, {following_ids: 1}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        let listOfLookingUp = user.following_ids;
        listOfLookingUp.push(username);
        db.posts.find({username: {$in: listOfLookingUp}}).sort({time: -1})
            .skip(MAX_POST_PER_PAGE * page)
            .limit(MAX_POST_PER_PAGE)
            .toArray(function (err, posts) {
                if(err) return res.status(500).end(err);
                else return res.json(posts);
            });
    })
};



exports.getPostPicture = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    let image_index = req.params.image_index;
    let sessionUsername = req.session.username;

    db.posts.findOne({_id: post_id}, function (err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }

        // Check if the current user is picture owner or the friends
        if (sessionUsername !== post.username) {
            db.users.find({_id: sessionUsername, following_ids: post.username}).count(function(err, count) {
                if (err) {
                    logger.error(err);
                    return res.status(500).end();
                }
                if (count !== 1) return res.status(403).end("Not Friend");
            });
        }
        res.setHeader('Content-Type', post.pictures[image_index].mimetype);
        res.sendFile(post.pictures[image_index].path, sendFileOption());
    });
};