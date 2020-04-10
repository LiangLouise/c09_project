let FaceData = function (req) {
    this._id = req.session.username;
    this.data = req.body.data;
};

module.exports = FaceData;