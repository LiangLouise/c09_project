const cookie = require('cookie');

let cookie_config;
if (process.env.NODE_ENV === 'production') {
    cookie_config = {
        path : '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: true
    };
} else {
    cookie_config = {
        path : '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: false,
        sameSite: false
    };
}


module.exports = {cookie, cookie_config};