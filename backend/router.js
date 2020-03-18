const express = require('express');
const {signin, signout, signup} = require('./controllers/authController');
const {createPost, getPostsByUser, getPostById, getPostPicture, deletePostById} = require('./controllers/postController');
const {followUser, unfollowUser, getFollowingList, isFollowing} = require('./controllers/followingController');
const {searchUser} = require("./controllers/searchController");
const {getAvatar, updateAvatar} = require("./controllers/profileController");
const validation = require('./utils/validation.js');
const {postUploads} = require('./config/multerconfig');
// const config = require('config');


module.exports = function (app) {
    const authRoutes = express.Router();
    const profileRoutes = express.Router();
    const postRoutes = express.Router();
    const followRoutes = express.Router();
    const searchRoutes = express.Router();

    app.use("/", authRoutes);
    authRoutes.post('/signup', validation.checkUsername('body'), signup);
    authRoutes.post('/signin', validation.checkUsername('body'), signin);
    authRoutes.get('/signout', signout);

    app.use("/api/posts", postRoutes);
    // POST /api/posts/
    // Body formData
    postRoutes.post('/', validation.isAuthenticated, postUploads,
        validation.notEmptyFiles, validation.checkImageFiles, createPost);

    // GET /api/posts/{PostID}/
    // Res: Status code: 403 -> Not Owner
    //                   404 -> Post doesn't exists
    //                   200 -> Success
    postRoutes.get('/:id/', validation.isAuthenticated, validation.isObjectId('params'), getPostById);

    // GET /api/posts/images/{image id}/
    // You can get the id from the previous one request
    postRoutes.get('/images/:id/', validation.isAuthenticated, validation.isObjectId('params'), getPostPicture);

    // DELETE /api/posts/{PostID}/
    // ONLY OWNER CAN DELETE THEIR OWN POSTS
    // Res: Status code: 403 -> Not Owner
    //                   404 -> Post doesn't exists
    //                   200 -> Success
    postRoutes.delete('/:id/', validation.isAuthenticated, validation.isObjectId('params'), deletePostById);

    // GET /api/posts/?username={friend username}&page={page number}
    // ONLY CAN VIEW following users' POSTS
    postRoutes.get('/', validation.isAuthenticated, validation.checkUsername('query'), getPostsByUser);

    app.use("/api/follow", followRoutes);
    // POST /api/follow/ {"username": "user to follow"}
    // Res: Status code: 409 -> Is friend already
    //                   200 -> Success
    followRoutes.post('/', validation.isAuthenticated, validation.checkUsername('body'),
        validation.notSameUser('body'), validation.checkIfUserExisting('body'), followUser);

    // DELETE /api/follow/{friend username to remove}
    // Res: Status code: 409 -> Not friend yet
    //                   200 -> Success
    followRoutes.delete('/:username/', validation.isAuthenticated, validation.checkUsername('params'),
        validation.notSameUser('params'), validation.checkIfUserExisting('params'), unfollowUser);

    // GET friend list
    // GET /api/follow/?page=number
    // Res: {"users": [Array of user ids]}
    followRoutes.get('/', validation.isAuthenticated, validation.checkPageNumber, getFollowingList);

    // GET /api/isfollowing/?username={the name to test}
    // Res: {"isFriend": true || false}
    followRoutes.get('/isfollowing/', validation.isAuthenticated, validation.checkUsername('query'), isFollowing);

    app.use("/api/search", searchRoutes);
    // Search User
    // GET /api/search/?username={user name}&page={number of page}
    // Res: {"users": [Array of user ids]}
    searchRoutes.get('/', validation.isAuthenticated, validation.checkUsername('query'), validation.checkPageNumber, searchUser);

    app.use("/api/profile", profileRoutes);
    // GET /api/avatar?username={name of user}
    // Res: avatar file
    profileRoutes.get('/avatar/', validation.isAuthenticated, validation.checkUsername('query'), getAvatar);

    // PUT /api/avatar
    // FormDat:
    //  Avatar
    // Res: 200 success
    profileRoutes.put('/avatar/', validation.isAuthenticated, validation.notEmptyFile, validation.checkImageFile, updateAvatar);
};