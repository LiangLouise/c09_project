const multer = require('multer');
const config = require('config');
const path = require('path');

let postPictures = multer({dest: config.get("uploads.post_pic_dest")});
let avatarPictures = multer({dest: config.get("avatar.uploads_dest")});

exports.postUploads = postPictures.array('picture', config.get("uploads.max_post_pic_number"));

exports.avatarUploads = avatarPictures.single('avatar');

exports.sendFileOption = function () {
    if (process.env.NODE_ENV === 'production') return {};
    else return {root: path.join(__dirname, "..")};
};

exports.defaultAvatarOption = {
  root: path.join(__dirname, "..")
};