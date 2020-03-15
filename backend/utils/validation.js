const validator = require('validator');

exports.isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

exports.checkUsername = function(req, res, next) {
    if (!req.body.username) return res.status(400).end("Body missing data");
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input on username");
    next();
};

exports.checkParamsUsername = function(req, res, next) {
    if (!req.params.username) return res.status(400).end("params missing username");
    if (!validator.isAlphanumeric(req.params.username)) return res.status(400).end("bad input on username");
    next();
};

exports.checkQueryUsername = function(req, res, next) {
    if (!req.query.username) return res.status(400).end("params missing username");
    if (!validator.isAlphanumeric(req.query.username)) return res.status(400).end("bad input on username");
    next();
};

exports.checkPageNumber = function(req, res, next) {
    if (!req.query.page) return res.status(400).end("params missing username");
    if (!validator.isInt(req.query.page)) return res.status(400).end("bad input on username");
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
    next();
};

exports.checkCommentLegth = function (req, res, next) {
    if (req.body.content.length > 150) return res.status(400).end("No More than 150 Characters");
    next();
};