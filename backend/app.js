const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const c_configs = require("./config/cookieconfigs.js");
const router = require('./router.js');
const config = require('config');

app.use(bodyParser.json());
app.use(session({
    secret: 'please change this secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        sameSite: true
    }
}));

app.use(express.static('static'));


// Set Header
app.use(function(req, res, next){
    // CORS
    res.setHeader('Access-Control-Allow-Origin', config.get("cors.domain"));
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    let username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', c_configs.cookie.serialize('username', username, c_configs.cookie_config));
    next();
});

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

router(app);

const http = require('http');
const PORT = config.get("port");

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});