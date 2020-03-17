const express = require('express');
const {signin, signout, signup} = require('./controllers/auth');
const {createPost, getPostByUser, getPostById, getPostPicture} = require('./controllers/posts');
const {addFriend, removeFriend, getFriendList, isFriend} = require('./controllers/users');
const {searchUser} = require("./controllers/search");
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
    apiRoutes.post('/posts', validation.isAuthenticated, postUploads,
        validation.notEmptyFile, validation.checkImage, createPost);

    // GET /api/posts/{PostID}/
    apiRoutes.get('/posts/:id/', validation.isAuthenticated, validation.isObjectId('params'), getPostById);

    // GET /api/posts/images/{image id}/
    apiRoutes.get('/posts/images/:id/', validation.isAuthenticated, validation.isObjectId('params'), getPostPicture);

    // GET /api/posts?username={friend username}&page={page number}
    // ONLY CAN VIEW FRIEND'S POSTS
    apiRoutes.get('/posts', validation.isAuthenticated,
        validation.checkUsername('query'), validation.checkIfFriend('query'), getPostByUser);

    // POST /api/friend {"username": "Friend username to add"}
    // Res: Status code: 409 -> Is friend already
    //                   200 -> Success
    apiRoutes.post('/friend', validation.isAuthenticated, validation.checkUsername('body'), addFriend);

    // DELETE /api/friend/{friend username to remove}
    // Res: Status code: 409 -> Not friend yet
    //                   200 -> Success
    apiRoutes.delete('/friend/:username/', validation.isAuthenticated, validation.checkUsername('params'),
        validation.checkIfUserExisting('params'), validation.checkIfFriend('params'), removeFriend);

    // GET friend list
    // GET /api/friend?page=number
    // Res: {"users": [Array of user ids]}
    apiRoutes.get('/friend', validation.isAuthenticated, validation.checkPageNumber, getFriendList);
    // GET /api/isfriend?username={the name to test}
    // Res: {"isFriend": true || false}
    apiRoutes.get('/isfriend', validation.isAuthenticated, validation.checkUsername('query'), isFriend);


    // Search User
    // GET /api/search?username={user name}&page={number of page}
    // Res: {"users": [Array of user ids]}
    apiRoutes.get('/search', validation.isAuthenticated, validation.checkUsername('query'), validation.checkPageNumber, searchUser);
};