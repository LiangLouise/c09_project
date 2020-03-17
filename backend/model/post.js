let Post = function (req, pictureIds) {
    this.title = req.body.title;
    this.username = req.session.username;
    // Array of picture Info
    this.pictures = pictureIds;
    this.dis = req.body.description;
    this.time =  Date.now();
    this.geolcation = "";
};

module.exports = Post;