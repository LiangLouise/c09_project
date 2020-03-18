const c_configs = require("../config/cookieconfigs");
const db = require("../services/dbservice");
const { generateHash } = require("../utils/hash");
const User = require("../model/user");
const logger = require('../config/loggerconfig');

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:5000/signup/
exports.signup = function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (user) return res.status(409).end("username " + username + " already exists");
        db.users.insert(new User(username, password), function (err, user) {
            if (err) {
                logger.error(err);
                return res.status(500).end();
            }
            // start a session after sign up
            req.session.username = username;
            return res.json("user " + username + " signed up");
        });
    });
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:5000/signin/
exports.signin = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    // retrieve user from the database
    db.users.findOne({_id: username}, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(500).end();
        }
        if (!user) return res.status(401).end("access denied");
        if (user.hash !== generateHash(password, user.salt)) return res.status(401).end("access denied");
        // start a session
        req.session.username = user._id;
        res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', user._id, c_configs.cookie_config));

        logger.info("Login response header", res.getHeaders());

        return res.json("user " + username + " signed in");
    });
};

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
exports.signout = function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', '', c_configs.cookie_config));
    return res.status(200).end();
};
