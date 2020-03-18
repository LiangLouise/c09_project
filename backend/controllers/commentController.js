const db = require("../services/dbservice");
const {ObjectId} = require('mongojs');
const config = require('config');
const Comment = require('../model/comment');
const logger = require('../config/loggerconfig');

const MAX_COMMENT_LENGTH = config.get('maxCommentLength');
const MAX_COMMENT_PER_PAGE = 20;

exports.addComment = function (req, res, next) {
    if (req.body.content.length > MAX_COMMENT_LENGTH) return res.status(400).end("No More than 150 Characters");

    let post_id = ObjectId(req.params.id);
    db.posts.find({ _id : post_id}).count(function(err, count){
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if(count !== 1) return res.status(404).end("No such post to comment");
        else {
            let comment = new Comment(req);
            db.comments.insert(comment, function (err, item) {
                if (err) {
                    logger.error(err);
                    return res.status(500).end();
                }
                else return res.json(item);
            });
        }
    });
};

exports.getCommentByPost = function (req, res, next) {
    let post_id = req.query.post_id;
    let page = req.query.page;
    db.comments.find({post_id: ObjectId(post_id)})
        .skip(MAX_COMMENT_PER_PAGE * page)
        .limit(MAX_COMMENT_PER_PAGE)
        .toArray(function (err, comments) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.json(comments);
        });
};

exports.getCommentCountByPost = function (req, res, next) {
    let post_id = req.query.post_id;
    db.comments.find({post_id: ObjectId(post_id)})
        .count(function (err, count) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.json({count: count});
        });
};
