const db = require("../services/dbservice");
const config = require('config');
const {sendFileOption, defaultAvatarOption} = require("../config/multerconfig");
const fs = require('fs');


exports.getAvatar = function (req, res, next) {
    let username = req.query.username;
    db.users.findOne({_id: username}, function(err, user) {
        if (err) return res.status(500).end(err);
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
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end();
        fs.unlink(user.avatar.path, (err) => {
            if (err) return res.status(500).end("Unable to delete the file");
        });
        db.users.update({_id: username}, {$set: {avatar: image}}, function(err, _) {
            if (err) return res.status(500).end(err);
            return res.status(200).end();
        })

    });
};