const multer = require('multer');
const config = require('config');

let postPictures = multer({dest: config.get("uploads.post_pic_dest")});

exports.postUploads = postPictures.array('picture', config.get("uploads.max_post_pic_number"));