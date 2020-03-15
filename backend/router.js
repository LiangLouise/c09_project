const express = require('express');
const {signin, signout, signup} = require('./controllers/auth');
const {uploadImage} = require('./controllers/uploads');
const {addFriend, removeFriend, getFriend} = require('./controllers/friend');
const validation = require('./utils/validation.js');
const multer = require('multer');
const config = require('config');


let upload = multer({dest: config.get("uploads")});

module.exports = function (app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use("/", authRoutes);
    authRoutes.post('/signup', validation.checkUsername, signup);
    authRoutes.post('/signin', validation.checkUsername, signin);
    authRoutes.get('/signout', signout);

    app.use("/api", apiRoutes);
    apiRoutes.post('/images', validation.isAuthenticated, upload.single('picture'), validation.notEmptyFile, validation.checkImage, uploadImage);

    // POST /api/friend {"username": "Friend username to add"}
    apiRoutes.post('/friend', validation.isAuthenticated, validation.checkUsername, addFriend);
    // DELETE /api/friend/{friend username to remove}
    apiRoutes.delete('/friend/:username/', validation.isAuthenticated, validation.checkParamsUsername, removeFriend);
    // GET /api/friend?page=number
    apiRoutes.get('/friend', validation.isAuthenticated, validation.checkQueryUsername, validation.checkPageNumber, removeFriend);
};