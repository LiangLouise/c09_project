const c_configs = require("../config/cookieconfigs");
const { db } = require("../services/dbservice");

exports.uploadImage = function (req, res, next) {
    db.images.insert({ title: req.body.title,
            author: req.username,
            picture: req.file },
        function (err, item) {
            if(err) return res.status(500).end(err);
            else return res.json({_id: item._id.toString()});
        });
};
