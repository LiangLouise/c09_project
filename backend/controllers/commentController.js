const db = require("../services/dbservice");
const {ObjectId} = require('mongojs');
const config = require('config');
const Comment = require('../model/comment');
const logger = require('../config/loggerconfig');

const MAX_COMMENT_LENGTH = config.get('comments.MAX_COMMENT_LENGTH');
const MAX_COMMENT_PER_PAGE = config.get('comments.MAX_COMMENT_PER_PAGE');

/**
 * @api {post} /api/posts/:id/comments Add a comment to the post
 * @apiName Create a new post
 * @apiGroup Comment
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt \
 *      -c cookie.txt \
 *      -X POST \
 *      -H "Content-Type: application/json"
 *      -d '{"content": "Looks very good!"} \
 *      localhost:5000/api/posts/jed5672jd90xfffsdg4wo/comments
 *
 * @apiHeader {String} Content-Type Must be `application/json`.
 *
 * @apiParam (Path Params) {String} id The id of Post which you want to comment on.
 * @apiParam (Request Body) {String} content The content of your comment, max length `100`.
 *
 * @apiSuccess (String) _id The id of the comment
 * @apiSuccess (Integer) time The time of the comment created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *         "_id": "jed5672jd90xfffsdg4wo"
 *         "time": 1586477573356
 *     }
 *
 * @apiError (Error 400) BadFormat content/post id has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner or the owner's follower.
 * @apiError (Error 404) NotFind Not find the post to comment.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.addComment = function (req, res, next) {
    if (req.body.content.length > MAX_COMMENT_LENGTH) return res.status(400).json({error: "No More than 150 Characters"});

    let post_id = ObjectId(req.params.id);
    db.posts.findOne({ _id : post_id}, function(err, post) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if(!post) return res.status(404).json({error: "No such post to comment"});
        db.users.find({_id: req.session.username, following_ids: post.username}).count(function(err, count) {
            if (err) return res.status(500).json({error: err});;
            if (count !== 1 && req.session.username !== post.username) return res.status(409).json({error: "Not Friend"});
            db.comments.insert(new Comment(req, post_id), function (err, item) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({error: err});
                }
                else return res.json(item);
            });
        });
    });
};

/**
 * @api {get} /api/posts/:id/comments/?page=:page Get Comments of Post
 * @apiName Get Comments by Post Id
 * @apiGroup Comment
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wo/comments/?page=0
 *
 *
 * @apiParam (Path Params) {String} id The id of Post which you want to comment on.
 * @apiParam (Request Query) {Integer} page The Page number of the comments to display, each page has at most `10` posts
 *
 * @apiSuccess {Objects[]} comments Array of the posts created by the user. The latest posts come first
 * @apiSuccess (String) comments._id The id of the comment
 * @apiSuccess (Integer) comments.time The time of the comment created.
 * @apiSuccess {String} comments.content The content of the comment.
 * @apiSuccess {String} comments.username The comment's author's name.
 * @apiSuccess {String} comments.post_id The of this id of post that the comment belongs to.

 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     [
 *      {
 *          "_id": "5e8fbeec5023721b3fb7b254",
 *          "content": "Looks very Good!",
 *          "username": "FlyDog",
 *          "post_id": 5e8fbee233c09f021093f4cf,
 *          "time": 1586380820095
 *      },
 *      {
 *          "_id": "5e8fbef16a267cee5f46862e",
 *          "content": "I wish I have it too",
 *          "username": "Fimith109",
 *          "post_id": 5e8fbee233c09f021093f4cf,
 *          "time": 1586391811095
 *      }
 *    ]
 *
 * @apiError (Error 400) BadFormat post id/page has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the post owner or the owner's follower
 * @apiError (Error 404) NotFind Not find user of the username
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getCommentByPost = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    let page = req.query.page;
    db.comments.find({post_id: post_id})
        .skip(MAX_COMMENT_PER_PAGE * page)
        .limit(MAX_COMMENT_PER_PAGE)
        .toArray(function (err, comments) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            if (comments.length > 0) {
                let post_author = comments[0].username;
                db.users.find({_id: req.session.username, following_ids: post_author}).count(function(err, count) {
                    if (err) return res.status(500).json({error: err});
                    if (count !== 1 && req.session.username !== post_author) return res.status(409).json({error: "Not Friend"});
                    return res.json(comments);
                });
            } else {
                return res.json(comments);
            }
        });
};

/**
 * @api {get} /api/posts/:id/commentsCount Get the count of the comments
 * @apiName Get the number of the comment the post has
 * @apiGroup Comment
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wo/commentsCount
 *
 *
 * @apiParam (Path Params) {String} id The id of Post which you want to comment on.
 *
 * @apiSuccess (Integer) count The number of the comments that the post has.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *         count: 2
 *     }
 *
 * @apiError (Error 400) BadFormat post id has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.getCommentCountByPost = function (req, res, next) {
    let post_id = ObjectId(req.params.id);
    db.comments.find({post_id: post_id})
        .count(function (err, count) {
            if (err) {
                logger.error(err);
                return res.status(500).json({error: err});
            }
            return res.json({count: count});
        });
};

/**
 * @api {delete} /api/posts/comments/:id/ Delete a Comment
 * @apiName Delete a Comment by its ID
 * @apiGroup Posts
 * @apiDescription Delete a Comment by its id, if success, empty response with status code `200`.
 *      Otherwise, response is error message with corresponding error message
 *      Note Only Comment owner or the Post owner can delete the comment.
 *
 *
 * @apiExample {curl} Example Usage:
 *  curl -x DELETE -b cookie.txt -c cookie.txt localhost:5000/api/posts/comments/5e8fc18270865f659e12fc42/
 *
 * @apiParam (Path Params) {String} id The unique id of the post to delete
 *
 * @apiSuccessExample {empty} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError (Error 400) BadFormat Request Query has the wrong format.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 403) AccessForbidden Not the comment owner or the post owner.
 * @apiError (Error 404) NotFind Not Find Comment with input id.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.deleteCommentById = function (req, res, next) {
  let comment_id = ObjectId(req.params.id);
  let sessionUsername = req.session.username;

  db.comments.findOne({_id: comment_id}, function (err, comment) {
      if (err) {
          logger.error(err);
          return res.status(500).json({error: err});
      }
      if (!comment) return res.status(404).json("Comment Not Find").
      db.users.findOne({_id: ObjectId(comment.post_id)}, function(err, post) {
          if (err) {
              logger.error(err);
              return res.status(500).json({error: err});
          }
          if (sessionUsername !== comment.username && sessionUsername !== post.username)
              return res.status(403).json({error: "You are not allowed delete other comments"});
          db.comments.remove({_id: comment_id}, function (err) {
              if (err) {
                  logger.error(err);
                  return res.status(500).json({error: err});
              }
              return res.status(200).end();
          });
      });
  });

};
