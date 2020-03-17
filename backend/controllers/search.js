const db = require("../services/dbservice");
const MAX_USER_PER_PAGE = 10;

exports.searchUser = function (req, res, next) {
    let userRegex = "^" + req.query.username + ".*";
    let page = req.query.page;
    db.users.find({_id: {$regex: userRegex}}).sort({_id: 1})
        .skip(page * MAX_USER_PER_PAGE)
        .limit(MAX_USER_PER_PAGE).toArray(function(err, users) {
            if (err) return res.status(500).end(err);
            return res.json({users: users.map((user) => user._id)});

    });
};