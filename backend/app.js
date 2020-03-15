const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const c_configs = require("./config/cookieconfigs.js");
const router = require('./router.js');
const config = require('config');
const logger = require('./config/loggerconfig');
const cors = require('cors');

// Set CORS rules
let options = config.get("cors");
app.use(cors(options));

app.use(bodyParser.json());

// Only Serve static file in production environment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('static'));
    app.set('trust proxy', true);
    app.use(session({
        secret: config.get("sessionSecret"),
        resave: false,
        saveUninitialized: true,
        proxy: true,
        cookie: {
            secure: false,
            sameSite: true
        }
    }));
} else {
    app.use(session({
        secret: config.get("sessionSecret"),
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            sameSite: 'none'
        }
    }));
}

// Set Header
app.use(function(req, res, next){
    // CORS
    // res.setHeader('Access-Control-Allow-Origin', config.get("cors.origin"));
    // res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    let username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', username, c_configs.cookie_config));
    logger.info("HTTP request %s %s %s %o", req.method, req.url, req.header("cookie"), req.body);
    next();
});

router(app);

const http = require('http');
const PORT = config.get("port");

http.createServer(app).listen(PORT, function (err) {
    if (err) logger.error(err);
    else logger.info("HTTP server on http://localhost:%s", PORT);
});