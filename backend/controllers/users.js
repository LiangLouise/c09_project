const db = require("../services/dbservice");

exports.addFriend = function(req, res, next) {
    // Get user name from session
    let username = req.username;
    // Get friend name from req body
    let friendToAdd = req.body.username;
    // Find Two users
    db.users.find({_id: {$in: [username, friendToAdd]}}, function(err, users) {
        if(err) return res.status(500).end(err);
        if (users.length !== 2) return res.status(404).end("No User " + friendToAdd);
        if ((users[0]._id === username && users[0].friend_ids.indexOf(users[1]._id) === -1)
            ||
            (users[1]._id === username && users[1].friend_ids.indexOf(users[0]._id) === -1)) {
            db.users.update({_id: users[0]._id}, {$addToSet: {friend_ids: users[1]._id}});
            db.users.update({_id: users[1]._id}, {$addToSet: {friend_ids: users[0]._id}});
            return res.status(200).end();
        }
        else return res.status(409).end("Already Friends");
    });
};

exports.removeFriend = function(req, res, next) {
    // Get user name from session
    let username = req.username;
    // Get friend name from req body
    let friendToRemove = req.params.username;
    // Find Two users
    db.users.find({_id: {$in: [username, friendToRemove]}}, function(err, users) {
        if(err) return res.status(500).end(err);
        if (users.length !== 2) return res.status(404).end("No User " + friendToRemove);
        if ((users[0]._id === username && users[0].friend_ids.indexOf(users[1]._id) !== -1)
            ||
            (users[1]._id === username && users[1].friend_ids.indexOf(users[0]._id) !== -1)) {
            db.users.update({_id: users[0]._id}, {$pull: {friend_ids: users[1]._id}});
            db.users.update({_id: users[1]._id}, {$pull: {friend_ids: users[0]._id}});
            return res.status(200).end();
        }
        else return res.status(409).end("Already Not Friends");
    });
};

exports.getFriend = function(req, res, next) {
    // Get user name from session
    let username = req.username;
    let page = req.query.page;
    db.users.findOne(
            {_id: username},
            {friend_ids: 1 , friend_ids: {$slice: [10*page, 10]}},
            function(err, user) {
        if(err) return res.status(500).end(err);
        return res.status(200).end(user.friend_ids);
    })
};

exports.isFriend = function(req, res, next) {
    // Get user name from session
    let username = req.username;
    let friendName = req.query.username;
    db.users.find({_id: username}, {friend_ids: {$in: [friendName]}}).count(function(err, count) {
        if (err) return res.status(500).end(err);
        if (count === 1) res.status(200).json({isFriend: true});
        else res.status(200).json({isFriend: false});
    })
};