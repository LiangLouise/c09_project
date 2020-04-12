const validator = require('validator');
const db = require("../services/dbservice");
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('config');

const MAX_POST_PICTURE_NUMBER = config.get("posts.MAX_POST_PICTURE_NUMBER");
const MAX_POST_TITLE_LENGTH = config.get("posts.MAX_POST_TITLE_LENGTH");
const MAX_POST_DES_LENGTH = config.get("posts.MAX_POST_DES_LENGTH");

exports.isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).json({error: "Access Denied"});
    next();
};

exports.checkUsername = function(path) {
    return function (req, res, next) {
        if (!req[path].username) return res.status(400).json({error: "Missing Username"});
        if (!validator.isAlphanumeric(req[path].username)) return res.status(400).json({error: "bad input on username"});
        next();
    }
};

exports.checkPageNumber = function(req, res, next) {
    if (!req.query.page) return res.status(400).json({error: "params missing PageNumber"});
    if (!validator.isInt(req.query.page)) return res.status(400).json({error: "bad input on PageNumber"});
    if (req.query.page < 0) return res.status(400).json({error: "PageNumber >= 0"});
    next();
};

exports.sanitizeComment = function(req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
};

exports.sanitizeFaceData = function(req, res, next) {
    req.body.descriptor = validator.escape(req.body.descriptor);
    next();
};

exports.sanitizePost = function(req, res, next) {
    if (req.body.title.length > MAX_POST_TITLE_LENGTH) return res.status(400).json({error: "Title Length too long"});
    if (req.body.description.length > MAX_POST_DES_LENGTH) return res.status(400).json({error: "Description Length too long"});
    req.body.title = validator.escape(req.body.title);
    req.body.description = validator.escape(req.body.description);
    next();
};

exports.notEmptyFiles = function(req, res, next) {
    if(!req.files) return res.status(400).json({error: "Not find the files"});
    next();
};

exports.checkImageFiles = function(req, res, next) {
    for (let file of req.files) {
        if (
            !file.mimetype.includes("jpeg") &&
            !file.mimetype.includes("jpg") &&
            !file.mimetype.includes("png") &&
            !file.mimetype.includes("gif")
        ) return res.status(400).json({error: "image format not supported"});
    }
    if (req.files.length > MAX_POST_PICTURE_NUMBER) return res.status(400).json({error: "At Most 9 pictures"});
    next();
};

exports.notEmptyFile = function(req, res, next) {
    if(!req.file) return res.status(400).json({error: "Not find the files"});
    next();
};

exports.checkImageFile = function(req, res, next) {
    if (
        !req.file.mimetype.includes("jpeg") &&
        !req.file.mimetype.includes("jpg") &&
        !req.file.mimetype.includes("png") &&
        !req.file.mimetype.includes("gif")
    ) return res.status(400).json({error: "image format not supported"});
    next();
};

exports.checkCommentLength = function (req, res, next) {
    if (req.body.content.length > 150) return res.status(400).json({error: "No More than 150 Characters"});
    next();
};


exports.checkIfUserExisting = function (path){
    return function (req, res, next) {
        let username;
        if (req[path].username) username = req[path].username;
        else return res.status(400).json({error: "request missing username"});
        db.users.find({_id: username}).count(function (err, count) {
            if (err) return res.status(500).json({error: err});
            if (count !== 1) return res.status(404).json({error: "User not Find"});
            next();
        });
    }
};

exports.checkIfFollowing = function (path) {
    return function (req, res, next) {
        db.users.find({_id: req.session.username, following_ids: req[path].username}).count(function(err, count) {
            if (err) return res.status(500).json({error: err});
            if (count !== 1) return res.status(409).json({error: "Not Friend"});
            next();
        });
    }
};

exports.isObjectId = function (path) {
  return function (req, res, next) {
      if (ObjectId.isValid(req[path].id)) next();
      else return res.status(400).json({error: 'Not a valid Mongo Object Id'});
  }
};

exports.notSameUser = function(path) {
    return function (req, res, next) {
        if (req[path].username === req.session.username) return res.status(400).json({error: "Same user, not Allowed"});
        next();
    }
};
