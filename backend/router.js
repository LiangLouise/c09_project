const express = require('express');
const {signin, signout, signup} = require('./controllers/auth');
const {createPost} = require('./controllers/posts');
const {addFriend, removeFriend, getFriend, isFriend} = require('./controllers/users');
const validation = require('./utils/validation.js');
const {postUploads} = require('./config/multerconfig');
// const config = require('config');


module.exports = function (app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use("/", authRoutes);
    authRoutes.post('/signup', validation.checkUsername('body'), signup);
    authRoutes.post('/signin', validation.checkUsername('body'), signin);
    authRoutes.get('/signout', signout);

    app.use("/api", apiRoutes);
    apiRoutes.post('/images', validation.isAuthenticated, postUploads,
        validation.notEmptyFile, validation.checkImage, createPost);

    // POST /api/friend {"username": "Friend username to add"}
    apiRoutes.post('/friend', validation.isAuthenticated, validation.checkUsername('body'), addFriend);
    // DELETE /api/friend/{friend username to remove}
    apiRoutes.delete('/friend/:username/', validation.isAuthenticated, validation.checkUsername('params'), removeFriend);
    // GET /api/friend?page=number
    apiRoutes.get('/friend', validation.isAuthenticated, validation.checkPageNumber, getFriend);
    // GET /api/isfriend?username={the name to test}
    apiRoutes.get('/isfriend', validation.isAuthenticated, validation.checkUsername('query'), isFriend);
};