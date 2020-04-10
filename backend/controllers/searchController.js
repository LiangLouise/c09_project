const db = require("../services/dbservice");
const logger = require('../config/loggerconfig');
const config = require('config');
const {redisClient} = require('../services/redisservice');

const MAX_USER_PER_PAGE = config.get("search.MAX_USER_PER_PAGE");
const REDIS_SEARCH_EXPIRE_TIME = config.get("redis.search_maxAge");

/**
 * @api {get} /api/search?username=:username&page=:page Search Users
 * @apiName Search Users by Username
 * @apiGroup Search
 *
 * @apiExample {curl} Example Usage:
 *  curl -b cookie.txt -c cookie.txt localhost:5000/api/search/?username=alice&page=0
 *
 * @apiParam (Request Query) {String} username username regex to search.
 * @apiParam (Request Query) {Integer} page the page number of the result, Each page has at most 10 result
 *
 * @apiSuccess {String[]} users Array of User ids that contains the username in request
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": ["roy", "flydog", "rockrock"]
 *     }
 *
 * @apiError (Error 400) BadFormat Username is not Alphanumeric or page is not an int.
 * @apiError (Error 401) AccessDeny Not Log In.
 * @apiError (Error 500) InternalServerError Error from backend.
 */
exports.searchUser = function (req, res, next) {
    let userRegex = "^" + req.query.username + ".*";
    let page = req.query.page;

    let search_key =  "search/" + req.query.username + "/" + page;
    redisClient.get(search_key, function (err, data) {
        if (err) {
            logger.error(err);
            return res.status(500).json({error: err});
        }
        if (data) {
            redisClient.expire(search_key, REDIS_SEARCH_EXPIRE_TIME);
            return res.json(JSON.parse(data));
        } else {
            db.users.find({_id: {$regex: userRegex}}).sort({_id: 1})
                .skip(page * MAX_USER_PER_PAGE)
                .limit(MAX_USER_PER_PAGE).toArray(function(err, users) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({error: err});
                }
                // Only Return the usernames other than the current user
                let response = {users: users.map(user => user._id).filter(id => id !== req.session.username)};

                // cache response in the redis
                redisClient.setex(search_key, REDIS_SEARCH_EXPIRE_TIME, JSON.stringify(response));

                return res.json(response);
            });
        }
    });
};
