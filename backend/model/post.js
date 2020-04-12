let Post = function (req) {
    this.title = req.body.title;
    this.username = req.session.username;
    // Array of picture Info
    this.pictures = req.files;
    this.picturesFaceData = [];
    this.pictureCounts = req.files.length;
    this.dis = req.body.description;
    this.time =  Date.now();
    this.geolocation = req.body.geolocation ? req.body.geolocation : {};
};

module.exports = Post;