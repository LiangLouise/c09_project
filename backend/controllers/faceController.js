const db = require("../services/dbservice");
const logger = require('../config/loggerconfig');
const faceapi = require('face-api.js');

exports.getPhotoFaceData = function (req, res, next) {
    let photo_id = req.query.photoId;
};