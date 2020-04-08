const faceapi = require('face-api.js');
const db = require("../services/dbservice");
const fs = require('fs');
const canvas = require('canvas');
const path = require('path');
const config = require('config');

let load = false;
if (!load) {
    load = true;
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk(config.get("faceapi.models")),
        faceapi.nets.faceLandmark68Net.loadFromDisk(config.get("faceapi.models"))
    ]);
}

let identifyFaces = async function (picture, faceMatcher) {
    let filePath = picture.path;
    if (process.env.NODE_ENV !== 'production') filePath = path.join(__dirname, "..") + filePath;

    let image = await canvas.loadImage(filePath);
    let displaySize = { width: image.width, height: image.height };
    let detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptor();

    const detectionsForSize = faceapi.resizeResults(detections, displaySize);
    const results = faceMatcher.findBestMatch(detectionsForSize.descriptor);
    return {...results, ...detectionsForSize};
};

exports.updateFaceData = async function (post_id) {

    db.posts.findOne({_id: post_id}, function (err, post) {
        db.users.findOne({_id: post_id.username}, function (err, user) {
            if (err) throw err;
            db.faceData.find({_id : {$in: user.follower_ids}}, function (err, descs) {
                let descriptors = {};
                if (descs.length === 0) return;
                for (let desc of descs){
                    descriptors[desc._id] = {
                        name: desc._id,
                        descriptors: new Float32Array(desc.data)
                    };
                }

                let pictures = post.pictures;
                let faceMatcher = new faceapi.FaceMatcher(descriptors, 0.6);
                let result = [];
                for (let pic of pictures) {
                    result.push(identifyFaces(pic, faceMatcher));
                }
                db.posts.updateOne({_id: post_id}, {picturesFaceData: result}, function (err) {
                    if (err) throw err;
                });
            });
        });

    });
};


