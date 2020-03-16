const c_configs = require("../config/cookieconfigs");
const db = require("../services/dbservice");

exports.createPost = function (req, res, next) {
    db.posts.insert({
            title: req.body.title,
            username: req.session.username,
            picture: req.files,
            dis: req.body.description,
            time: Date.now()
        },
        function (err, item) {
            if(err) return res.status(500).end(err);
            else return res.json({_id: item._id.toString()});
        });
};

// exports.getPostByUser = function (req, res, next) {
//     db.posts.find({username: req.query.username}).sort({time: -1});
// };