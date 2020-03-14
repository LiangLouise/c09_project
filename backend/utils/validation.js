const validator = require('validator');

exports.isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

exports.checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input on username");
    next();
};

exports.sanitizeContent = function(req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
};

exports.checkId = function(req, res, next) {
    if (!validator.isAlphanumeric(req.params.id)) return res.status(400).end("bad input on req params ID");
    next();
};

exports.notEmptyFile = function(req, res, next) {
    if(!req.file) return res.status(400).end("Not find the file");
    next();
};

exports.checkImage = function(req, res, next) {
    if (
        !req.file.mimetype.includes("jpeg") &&
        !req.file.mimetype.includes("jpg") &&
        !req.file.mimetype.includes("png") &&
        !req.file.mimetype.includes("gif")
    ) return res.status(400).end("Not a Image File");
    next()
};