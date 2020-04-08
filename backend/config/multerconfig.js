const multer = require('multer');
const config = require('config');
const path = require('path');

const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.get("uploads.post_pic_dest"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

let postPictures = multer({storage: postStorage});
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