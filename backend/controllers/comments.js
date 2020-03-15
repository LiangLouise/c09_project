const db = require("../services/dbservice");

exports.addComment = function (req, res, next) {
    if (!req.body.imageId || !req.body.content) return res.status(400).end("request missing fields");
    if (req.body.content.length > 150) return res.status(400).end("No More than 150 Characters");
    let comment = new Comment(req.body, req.username);
    db.images.findOne({ _id : comment.imageId}, {picture: 0, updatedAt:0, createdAt:0}, function(err, image){
        if(err) return res.status(500).end(err);
        if(!image) return res.status(404).end("No such Image " + comment.imageId +" to comment");
        else {
            comments.insert(comment, function (err, item) {
                if(err) return res.status(500).end(err);
                else return res.json(comment);
            });
        }
    });
};