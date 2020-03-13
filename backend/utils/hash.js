const crypto = require('crypto');

exports.generateSalt = function(){
    return crypto.randomBytes(16).toString('base64');
};

exports.generateHash = function(password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
};