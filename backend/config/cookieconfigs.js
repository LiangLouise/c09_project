const cookie = require('cookie');
const cookie_config = {
    path : '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: true
};

module.exports = {cookie, cookie_config};