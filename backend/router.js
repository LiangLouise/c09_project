const express = require('express');
const {signin, signout, signup} = require('./controllers/auth');
const {isAuthenticated, checkId, checkUsername, sanitizeContent} = require('./utils/validation.js');

module.exports = function (app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use("/", authRoutes);
    authRoutes.post('/signup/', checkUsername, signup);
    authRoutes.post('/signin/', checkUsername, signin);
    authRoutes.get('/signout/', signout);

};