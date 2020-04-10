const express = require('express');
const {signin, signout, signup} = require('./controllers/authController');
const {createPost, getPostsByUser, getPostById, getPostPicture, deletePostById, getPostOfFollowing} = require('./controllers/postController');
const {followUser, unfollowUser, getFollowingList, isFollowing, getFollowerList, isFollowedBy} = require('./controllers/followingController');
const {searchUser} = require("./controllers/searchController");
const {getAvatar, updateAvatar, updateFaceData, getFaceData, getUserProfile} = require("./controllers/profileController");
const {addComment, getCommentByPost, getCommentCountByPost, deleteCommentById} = require("./controllers/commentController");
const validation = require('./utils/validation.js');
const {postUploads, avatarUploads} = require('./config/multerconfig');
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

    postRoutes.post('/', validation.isAuthenticated, postUploads, validation.sanitizePost,
        validation.notEmptyFiles, validation.checkImageFiles, createPost);

    // POST /api/posts/{PostID}/comments/ {"content": "Your Comment Content"}
    postRoutes.post('/:id/comments/', validation.isAuthenticated, validation.sanitizeComment,
        validation.isObjectId('params'), addComment);

    // GET /api/posts/following/?page={page number}
    // user to see the all the posts created by their following
    postRoutes.get('/following/', validation.isAuthenticated, validation.checkPageNumber, getPostOfFollowing);

    // GET /api/posts/{PostID}/
    // Res: Status code: 403 -> Not Owner
    //                   404 -> Post doesn't exists
    //                   200 -> Success
    postRoutes.get('/:id/', validation.isAuthenticated, validation.isObjectId('params'), getPostById);

    // Get Posts comments
    // GET /api/posts/{PostID}/comments/?page={page number}
    postRoutes.get('/:id/comments/', validation.isAuthenticated, validation.isObjectId('params'), validation.checkPageNumber, getCommentByPost);

    postRoutes.get('/:id/commentsCount/', validation.isAuthenticated, validation.isObjectId('params'), getCommentCountByPost);

    // GET /api/posts/{PostID}/images/{image_index}/
    // You can get the total number of images from GET /api/posts/{PostID}/ as "pictureCounts"
    postRoutes.get('/:id/images/:image_index/', validation.isAuthenticated, validation.isObjectId('params'), getPostPicture);

    // DELETE /api/posts/{PostID}/
    // ONLY OWNER CAN DELETE THEIR OWN POSTS
    // Res: Status code: 403 -> Not Owner
    //                   404 -> Post doesn't exists
    //                   200 -> Success
    postRoutes.delete('/:id/', validation.isAuthenticated, validation.isObjectId('params'), deletePostById);

    postRoutes.delete('/comments/:id/', validation.isAuthenticated, validation.isObjectId('params'), deleteCommentById);

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

    // GET Following list
    // GET /api/follow/?page=number
    // Res: {"users": [Array of user ids]}
    followRoutes.get('/', validation.isAuthenticated, validation.checkPageNumber, getFollowingList);

    // GET /api/follow/isfollowing/?username={the name to test}
    // Res: {"isFriend": true || false}
    followRoutes.get('/isfollowing/', validation.isAuthenticated, validation.checkUsername('query'), isFollowing);

    // GET list of user's followers
    // GET /api/follow/followers/?page={number}
    followRoutes.get('/followers/', validation.isAuthenticated, validation.checkPageNumber, getFollowerList);

    // Check if the user is followed by user in the query
    // GET /api/follow/isfollowed/?username={the name to test}
    // Res: {"isFriend": true || false}
    followRoutes.get('/isfollowed/', validation.isAuthenticated, validation.checkUsername('query'), isFollowedBy);

    app.use("/api/search", searchRoutes);
    // Search User
    // GET /api/search/?username={user name}&page={number of page}
    // Res: {"users": [Array of user ids]}
    searchRoutes.get('/', validation.isAuthenticated, validation.checkUsername('query'), validation.checkPageNumber, searchUser);

    app.use("/api/profile", profileRoutes);

    // GET /api/profile?username={name of user}
    // Res {follower_ids: [], following_ids: [], post_counts: {number}}
    profileRoutes.get('/', validation.isAuthenticated, validation.checkUsername('query'), getUserProfile);

    // GET /api/profile/avatar?username={name of user}
    // Res: avatar file
    profileRoutes.get('/avatar/', validation.isAuthenticated, validation.checkUsername('query'), getAvatar);

    // PUT /api/profile/avatar
    // FormDat:
    //  Avatar
    // Res: 200 success
    profileRoutes.post('/avatar/', validation.isAuthenticated, avatarUploads, validation.notEmptyFile, validation.checkImageFile, updateAvatar);

    profileRoutes.put('/facedata/', validation.isAuthenticated, validation.sanitizeFaceData, updateFaceData);

    // profileRoutes.get('/facedata/', validation.isAuthenticated, getFaceData);
};