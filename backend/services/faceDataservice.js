require('@tensorflow/tfjs-node');
const faceapi = require('face-api.js');
const db = require("../services/dbservice");
const fs = require('fs');
const Can = require('canvas');
const path = require('path');
const config = require('config');
const { Canvas, Image, ImageData } = Can;

const savePath = config.get("faceapi.results");

let load = false;
if (!load) {
    load = true;
    let path = config.get("faceapi.models");
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk(path),
        faceapi.nets.faceLandmark68Net.loadFromDisk(path),
        faceapi.nets.ssdMobilenetv1.loadFromDisk(path)
    ]);
}

exports.updateFaceData = async function (post_id) {

    db.posts.findOne({_id: post_id}, function (err, post) {
        db.users.findOne({_id: post.username}, function (err, user) {
            if (err) throw err;
            let lst_to_search = user.follower_ids.concat(user._id);
            db.users.find({$and: [{ _id: {$in: lst_to_search}}, {descriptor: {$ne: []}}]},
                    {descriptor: 1},
                    async function (err, users) {

                let labeledFaceDescriptors = [];
                if (users.length === 0) return;
                users.forEach(user => {
                    labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(user._id, [new Float32Array(user.descriptor)]));
                });

                let pictures = post.pictures;
                let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
                let result = [];
                for (const pic of pictures) {
                    let filePath = pic.path;
                    if (process.env.NODE_ENV !== 'production') filePath = path.join(__dirname, "../") + filePath;

                    let image = await Can.loadImage(filePath);
                    let fullFaceDescriptions = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
                    let canvas = Can.createCanvas(image.width, image.height);
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, image.width, image.height);

                    let single = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));
                    // Push an original file to take the position
                    if (single.length === 0) result.push(pic.path);
                    single.forEach((bestMatch, i) => {
                        const box = fullFaceDescriptions[i].detection.box;
                        const text = bestMatch.toString();
                        console.log(bestMatch._distance);
                        if (bestMatch._distance < 0.55)
                        {
                            const drawBox = new faceapi.draw.DrawBox(box, { label: text, lineWidth: 9 });
                            drawBox.draw(canvas);
                        }
                    });

                    let buf = canvas.toBuffer(pic.mimetype);
                    fs.writeFileSync(savePath + pic.filename, buf);
                    result.push(savePath + pic.filename);
                }
                db.posts.updateOne({_id: post_id}, { $set: {picturesFaceData: result} }, function (err) {
                    if (err) throw err;
                });
            });
        });

    });
};


