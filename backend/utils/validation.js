const validator = require('validator');
const db = require("../services/dbservice");
const ObjectId = require('mongoose').Types.ObjectId;

exports.isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

exports.checkUsername = function(path) {
    return function (req, res, next) {
        if (!req[path].username) return res.status(400).end("Missing Username");
        if (!validator.isAlphanumeric(req[path].username)) return res.status(400).end("bad input on username");
        next();
    }
};

exports.checkPageNumber = function(req, res, next) {
    if (!req.query.page) return res.status(400).end("params missing username");
    if (!validator.isInt(req.query.page)) return res.status(400).end("bad input on username");
    next();
};

exports.sanitizeContent = function(req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
};

exports.notEmptyFiles = function(req, res, next) {
    if(!req.files) return res.status(400).end("Not find the files");
    next();
};

exports.checkImageFiles = function(req, res, next) {
    for (let file of req.files) {
        if (
            !file.mimetype.includes("jpeg") &&
            !file.mimetype.includes("jpg") &&
            !file.mimetype.includes("png") &&
            !file.mimetype.includes("gif")
        ) return res.status(400).end("image format not supported");
    }
    next();
};

exports.notEmptyFile = function(req, res, next) {
    if(!req.file) return res.status(400).end("Not find the files");
    next();
};

exports.checkImageFile = function(req, res, next) {
    if (
        !req.file.mimetype.includes("jpeg") &&
        !req.file.mimetype.includes("jpg") &&
        !req.file.mimetype.includes("png") &&
        !req.file.mimetype.includes("gif")
    ) return res.status(400).end("image format not supported");
    next();
};

exports.checkCommentLength = function (req, res, next) {
    if (req.body.content.length > 150) return res.status(400).end("No More than 150 Characters");
    next();
};


exports.checkIfUserExisting = function (path){
    return function (req, res, next) {
        let username;
        if (req[path].username) username = req[path].username;
        else return res.status(400).end("request missing username");
        db.users.find({_id: username}).count(function (err, count) {
            if (err) return res.status(500).end(err);
            if (count !== 1) return res.status(404).end("User not Find");
        });
        next();
    }
};

exports.checkIfFriend = function (path) {
    return function (req, res, next) {
        db.users.find({_id: req.session.username, friend_ids: req[path].username}).count(function(err, count) {
            if (err) return res.status(500).end(err);
            if (count !== 1) return res.status(409).end("Not Friend");
        });
        next();
    }
};

exports.isObjectId = function (path) {
  return function (req, res, next) {
      if (ObjectId.isValid(req[path].id)) next();
      else return res.status(400).end('Not a valid Mongo Object Id');
  }
};

exports.notSameUser = function(path) {
    return function (req, res, next) {
        if (req[path].username === req.session.username) return res.status(400).end("Same user, not Allowed");
        next();
    }
};