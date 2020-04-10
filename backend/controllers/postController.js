const {ObjectId} = require('mongojs');
const db = require("../services/dbservice");
const Post = require("../model/post");
const {sendFileOption} = require("../config/multerconfig");
const fs = require('fs');
const logger = require('../config/loggerconfig');
const config = require('config');
const {redisClient} = require('../services/redisservice');

const MAX_POST_PER_PAGE = config.get("posts.MAX_POST_PER_PAGE");

/**
 * @api {post} /api/posts Create a new Post
 * @apiName Create Post
 * @apiGroup Posts
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt \
 *      -c cookie.txt \
 *      -F "title=hello" \
 *      -F "description=My New Post!" \
 *      -F "pictures=@hello.jpg"
 *      localhost:5000/api/posts
 *
 * @apiHeader {String} Content-Type Must be `multipart/form-data`.
 *
 * @apiParam (Form Data) {String} title Title of the post, no more than `30` chars.
 * @apiParam (Form Data) {Integer} description The content of the post, no more than `200` chars.
 * @apiParam (Form Data) {Files} pictures An array of Post pictures, accepted Format: `.jpeg/.jpg/.png/.gif` and no more than `9` pictures.
 *
 * @apiSuccess {String} _id The id of the post
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
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
                return res.status(500).json({error: err});
            }
            try {
                db.users.update({_id: sessionUsername}, {$inc: {post_counts: 1}});
            } catch (e) {
                logger.error(e);
                return res.status(500).json({error: err});
            }
            return res.json({_id: item._id.toString()});
    });
};

/**
 * @api {get} /api/posts/:id/ Get Post By Post id
 * @apiName Get Post by Post id
 * @apiGroup Posts
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wo/
 *
 *
 * @apiParam (Path Params) {String} id The unique id of the post
 *
 * @apiSuccess (String) _id The unique id of the post
 * @apiSuccess {String} title The title of the post
 * @apiSuccess {String} dis The description of the post
 * @apiSuccess {Integer} pictureCounts The number of the pictures this post has
 * @apiSuccess {Integer} time The time of post creation

 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "_id": "jed5672jd90xfffsdg4wo",
 *       "title": "Hello",
 *       "dis": "This is my first post",
 *       "pictureCounts": 2,
 *       "time": 1586391820095
 *     }
 *
 * @apiError (Error 400) BadFormat Path Params id has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner or the owner's follower
 * @apiError (Error 404) NotFind Not find post with such id
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getPostById = function (req, res, next) {
    let id = req.params.id;
    let sessionUsername = req.session.username;
    let post_key = sessionUsername + "/post/" + id;

    db.posts.findOne({_id: ObjectId(id)}, {pictures: 0, picturesFaceData: 0, geolcation: 0}, function(err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (!post) return res.status(404).json({error: "Post doesn't exits"});
        // Check if the current user is user himself or the friends
        if (sessionUsername === post.username) return res.json(post);
        else {
            db.users.find({_id: sessionUsername, following_ids: post.username}).count(function(err, count) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({error: err});
                }
                if (count !== 1) return res.status(403).json({error: "Not Friend"});
                return res.json(post);
            });
        }
    });
};

/**
 * @api {get} /api/posts/?username=:username&page=:page Get Posts By username
 * @apiName Get Posts of some user
 * @apiGroup Posts
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/?username=Alice&page=0
 *
 *
 * @apiParam (Request Query) {String} username The username of the posts owner, can only be user himself or the user's fpllowing
 * @apiParam (Request Query) {Integer} page The Page number of the posts to display, each page has at most `10` posts
 *
 * @apiSuccess {Objects[]} posts Array of the posts created by the user. The latest posts come first
 * @apiSuccess {String} posts._id The unique id of the post
 * @apiSuccess {String} posts.title The title of the post
 * @apiSuccess {String} posts.dis The description of the post
 * @apiSuccess {Integer} posts.pictureCounts The number of the pictures this post has
 * @apiSuccess {Integer} posts.time The time of post creation

 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     [
 *      {
 *          "_id": "jed5672jd90xfffsdg4wo",
 *          "title": "Hello",
 *          "dis": "This is my first post",
 *          "pictureCounts": 2,
 *          "time": 1586391820095
 *      },
 *      {
 *          "_id": "jed5672jd90xfffsdg4wo",
 *          "title": "Good Morning",
 *          "dis": "This is my second post",
 *          "pictureCounts": 2,
 *          "time": 1586391820095
 *      }
 *    ]
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner or the owner's follower
 * @apiError (Error 404) NotFind Not find user of the username
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getPostsByUser = function (req, res, next) {
    let page = req.query.page;
    let sessionUsername = req.session.username;
    let queryUsername = req.query.username;

    // If the query name is not the same as the session user name, then check if they are friends
    if (sessionUsername !== queryUsername) {
        db.users.find({_id: sessionUsername, following_ids: queryUsername}).count(function(err, count) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            if (count !== 1) return res.status(403).json({error: "Not Friend"});
        });
    }
    db.posts.find({username: queryUsername}, {pictures: 0}).sort({time: -1})
        .skip(MAX_POST_PER_PAGE * page)
        .limit(MAX_POST_PER_PAGE)
        .toArray(function (err, posts) {
            if(err) return res.status(500).json({error: err});
            else {
                return res.json(posts);
            }
        });
};

/**
 * @api {get} /api/posts/following/?page=:page Get the posts of following
 * @apiName See the all the posts created by user's following
 * @apiGroup Posts
 * @apiDescription Get the posts of following, if success, a list of posts sliced by page number will be sent back.
 *      Otherwise, response is error message with corresponding error message.
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/following/?page=0
 *
 *
 * @apiParam (Request Query) {Integer} page The Page number of the posts to display, each page has at most `10` posts
 *
 * @apiSuccess {Objects[]} posts Array of the posts created by the user. The latest posts come first
 * @apiSuccess {String} posts._id The unique id of the post
 * @apiSuccess {String} posts.username The creator of the post
 * @apiSuccess {String} posts.title The title of the post
 * @apiSuccess {String} posts.dis The description of the post
 * @apiSuccess {Integer} posts.pictureCounts The number of the pictures this post has
 * @apiSuccess {Integer} posts.time The time of post creation

 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     [
 *      {
 *          "_id": "jed5672jd90xfffsdg4wo",
 *          "title": "What a nice day",
 *          "username": "Leo11"
 *          "dis": "How are you?",
 *          "pictureCounts": 7,
 *          "time": 1586391820095
 *      },
 *      {
 *          "_id": "jed5672jd90xfffsdg4wk",
 *          "title": "Good Morning",
 *          "username": "Flydog"
 *          "dis": "Looks delicious",
 *          "pictureCounts": 1,
 *          "time": 1586391820033
 *      }
 *    ]
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getPostOfFollowing = function (req, res, next) {
    let sessionUsername = req.session.username;
    let page = req.query.page;

    db.users.findOne({_id: sessionUsername}, {following_ids: 1}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        let listOfLookingUp = user.following_ids;
        // Ignore the userself
        //listOfLookingUp.push(sessionUsername);
        db.posts.find({username: {$in: listOfLookingUp}}, {pictures: 0}).sort({time: -1})
            .skip(MAX_POST_PER_PAGE * page)
            .limit(MAX_POST_PER_PAGE)
            .toArray(function (err, posts) {
                if(err) return res.status(500).json({error: err});
                else {
                    console.log("mongo", data);
                    return res.json(posts);
                }
            });
    })
};

/**
 * @api {get} /api/posts/:id/images/:image_index/ Get the picture of the post
 * @apiName Get the picture of the post
 * @apiGroup Posts
 * @apiDescription Get the picture of the post by it's index, if success, a image file will be sent.
 *      Otherwise, response is error message with corresponding error message.
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wk/images/0/
 *
 * @apiParam (Path Params) {String} id The unique id of the post
 * @apiParam (Path Params) {String} image_index The index of the picture, to indicate which image to get, max value decided by `posts.pictureCounts`
 *
 * @apiSuccess {BinaryFile} image The binary of the image file, the format `Content-Type` is in response header.
 *
 * @apiSuccessExample {BinaryFile} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: images/jpeg
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner or the owner's follower.
 * @apiError (Error 404) NotFind Not find Image or Post in the path.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getPostPicture = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    let image_index = req.params.image_index;
    let sessionUsername = req.session.username;

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
                if (count !== 1) return res.status(403).json({error: "Not Friend"});
            });
        }
        res.setHeader('Content-Type', post.pictures[image_index].mimetype);
        res.sendFile(post.pictures[image_index].path, sendFileOption());
    });
};

/**
 * @api {delete} /api/posts/:id/ Delete a Post By Post id
 * @apiName Delete a Post
 * @apiGroup Posts
 * @apiDescription Delete a Post by its id, if success, empty response with status code `200`.
 *      Otherwise, response is error message with corresponding error message
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -x DELETE -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wk/
 *
 * @apiParam (Path Params) {String} id The unique id of the post to delete
 *
 * @apiSuccessExample {empty} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner.
 * @apiError (Error 404) NotFind Not Image or Post in the path.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.deletePostById = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    let sessionUsername = req.session.username;

    db.posts.findOne({_id: post_id}, function(err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (!post) return res.status(404).json({error: "Post doesn't exits"});
        // Check if the current user is user himself
        if (sessionUsername !== post.username) return res.status(403).json({error: "You are not the owner of the post"});
        db.posts.findOne({_id: post_id}, function (err, post) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            for (let pic of post.pictures){
                fs.unlink(pic.path, err => {
                    if (err) return res.status(500).json({error: err});
                })
            }
            try {
                // Remove all records related to posts
                db.posts.remove({_id: post_id});
                db.comments.remove({post_id: post_id});
                db.users.update({_id: sessionUsername}, {$inc: {post_counts: -1}});
            } catch (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.status(200).end();
        })
    });
};
