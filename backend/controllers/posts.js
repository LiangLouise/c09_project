const {ObjectId} = require('mongojs');
const db = require("../services/dbservice");
const Post = require("../model/post");
const {sendFileOption} = require("../config/multerconfig");
const MAX_POST_PER_PAGE = 10;

exports.createPost = function (req, res, next) {
    db.images.insertMany(req.files, {ordered: true},
        function (err, images) {
        if (err) return res.status(500).end(err);
        let imageIDs = images.map(image => image._id);
        db.posts.insert(new Post(req, imageIDs),
            function (err, item) {
                if(err) return res.status(500).end(err);
                db.images.update({_id: {$in: imageIDs}},
                    {$set: {post_id: item._id, username: req.session.username}},
                    {multi: true},
                    function (err, _) {
                    if(err) return res.status(500).end(err);
                    return res.json({_id: item._id.toString()});
                });
        });
    });
};

exports.getPostById = function (req, res, next) {
    let id = req.params.id;
    db.posts.findOne({_id: ObjectId(id)}, function(err, post) {
        if(err) return res.status(500).end(err);

        // Check if the current user is user himself or the friends
        if (req.session.username === post.username) return res.json(post);
        else {
            db.users.find({_id: req.session.username, friend_ids: post.username}).count(function(err, count) {
                if (err) return res.status(500).end(err);
                if (count !== 1) return res.status(403).end("Not Friend");
                return res.json(post);
            });
        }
    });
};

exports.getPostByUser = function (req, res, next) {
    let page = req.query.page;
    db.posts.find({username: req.query.username}).sort({time: -1})
        .skip(MAX_POST_PER_PAGE * page)
        .limit(MAX_POST_PER_PAGE)
        .toArray(function (err, posts) {
            if(err) return res.status(500).end(err);
            else return res.json(posts);
        });
};

exports.getPostPicture = function (req, res, next) {
    let id = req.params.id;
    db.images.findOne({_id: ObjectId(id)}, function (err, image) {
        if(err) return res.status(500).end(err);

        // Check if the current user is user himself or the friends
        if (req.session.username === image.username) {
            res.setHeader('Content-Type', image.mimetype);
            res.sendFile(image.path, sendFileOption());
        }
        else {
            db.users.find({_id: req.session.username, friend_ids: image.username}).count(function(err, count) {
                if (err) return res.status(500).end(err);
                if (count !== 1) return res.status(403).end("Not Friend");
                res.setHeader('Content-Type', image.mimetype);
                res.sendFile(image.path, sendFileOption());
            });
        }
    });
};