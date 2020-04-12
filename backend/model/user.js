const { generateSalt, generateHash } = require("../utils/hash");


let User = function (username, password) {
    this._id = username;
    this.salt = generateSalt();
    this.hash = generateHash(password, this.salt);
    this.friend_ids = [];
    this.follower_ids = [];
    this.following_ids = [];
    this.avatar = {};
    this.post_counts = 0;
    this.descriptor = [];
};

module.exports = User;