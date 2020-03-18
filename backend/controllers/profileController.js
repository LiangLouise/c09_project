const db = require("../services/dbservice");
const config = require('config');
const {sendFileOption, defaultAvatarOption} = require("../config/multerconfig");
const fs = require('fs');
const faceData = require('../model/faceData');
const logger = require('../config/loggerconfig');

exports.getAvatar = function (req, res, next) {
    let username = req.query.username;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        // If there is no avatar uploaded
        if (!user.avatar.path) {
            res.setHeader('Content-Type', config.get("avatar.default_mimetype"));
            res.sendFile(config.get("avatar.default_filePath"), defaultAvatarOption);
        } else {
            res.setHeader('Content-Type', user.avatar.mimeType);
            res.sendFile(user.avatar.path, sendFileOption());
        }
    });
};

exports.updateAvatar = function (req, res, next) {
    let username = req.session.username;
    let image = req.file;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(404).end();
        fs.unlink(user.avatar.path, (err) => {
            if (err) return res.status(500).end("Unable to delete the file");
        });
        db.users.update({_id: username}, {$set: {avatar: image}}, function(err, _) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            return res.status(200).end();
        });
    });
};

exports.updateFaceData = function (req, res, next) {
    let userName = req.session.username;
    let data = req.body.facedata;
    db.facedata.update(new faceData(userName, data), {upsert: true}, function (err, data) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        else return res.status(200).end();
    });
};

exports.getFaceData = function (req, res, next) {
    let userName = req.session.username;
    db.facedata.findOne({_id: userName}, function (err, facedata) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!facedata) return res.json({data: {}});
        return res.json({data: facedata.data});
    });
};