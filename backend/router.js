const express = require('express');
const {signin, signout, signup} = require('./controllers/auth');
const {uploadImage} = require('./controllers/uploads');
const {isAuthenticated, checkId, checkUsername, sanitizeContent, checkImage, notEmptyFile} = require('./utils/validation.js');
const multer = require('multer');
const config = require('config');


let upload = multer({dest: config.get("uploads")});

module.exports = function (app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use("/", authRoutes);
    authRoutes.post('/signup', checkUsername, signup);
    authRoutes.post('/signin', checkUsername, signin);
    authRoutes.get('/signout', signout);

    app.use("/api", apiRoutes);
    apiRoutes.post('/images', isAuthenticated, upload.single('picture'), notEmptyFile, checkImage, uploadImage);

};