const c_configs = require("../config/cookieconfigs");
const db = require("../services/dbservice");
const { generateHash } = require("../utils/hash");
const User = require("../model/user");
const logger = require('../config/loggerconfig');

/**
 * @api {post} /signup Register a new account
 * @apiName Sign Up
 * @apiGroup Auth
 *
 * @apiExample {curl} Example Usage:
 *  curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:5000/signup/
 *
 * @apiHeader {String} Content-Type Only Accept `application/json`.
 *
 * @apiParam (Body) {String} username New User Username, must be Alphanumeric.
 * @apiParam (Body) {String} password New User Password.
 *
 * @apiSuccess {String} success user {username} signed up
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "user {username} signed up"
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumeric
 * @apiError (Error 409) UsernameUsed The Username has been used by others.
 * @apiError (Error 500) InternalServerError Error Message from backend.
 */
exports.signup = function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end(err);
        }
        if (user) return res.status(409).end("username " + username + " already exists");
        db.users.insert(new User(username, password), function (err, user) {
            if (err) {
                logger.error(err);
                return res.status(500).end(err);
            }
            return res.json({
                success: "user " + username + " signed up"
            });
        });
    });
};

/**
 * @api {post} /signin User Sign In
 * @apiName Sign In
 * @apiGroup Auth
 *
 * @apiExample {curl} Example Usage:
 *  curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:5000/signin/
 *
 * @apiHeader {String} Content-Type Only Accept `application/json`.
 *
 * @apiParam (Body) {String} username Username of the user to sign in, must be Alphanumeric.
 * @apiParam (Body) {String} password Password of the user to sign in.
 *
 * @apiSuccess {String} success user {username} signed in
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "user {username} signed up"
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumeric
 * @apiError (Error 401) AccessDeny Wrong Username/Password.
 * @apiError (Error 500) InternalServerError Error Message from backend.
 */
exports.signin = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    // retrieve user from the database
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end(err);
        }
        if (!user) return res.status(401).end("access denied");
        if (user.hash !== generateHash(password, user.salt)) return res.status(401).end("access denied");
        // start a session
        req.session.username = user._id;
        res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', user._id, c_configs.cookie_config));

        logger.info("Login response header", res.getHeaders());

        return res.json({
            success: "user " + username + " signed in"
        });
    });
};

/**
 * @api {get} /signout User Sign Out
 * @apiName Sign Out
 * @apiGroup Auth
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:3000/signout/
 *
 * @apiSuccess {String} success user {username} signed out
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "user {username} signed out"
 *     }
 *
 */
exports.signout = function (req, res, next) {
    let username = req.session.username;
    req.session.destroy();
    res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', '', c_configs.cookie_config));
    return res.json({
        success: "user " + username + " signed out"
    });
};
