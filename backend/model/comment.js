let Comment= function (req) {
  this.post_id = req.body.post_id;
  this.username = req.body.username;
  this.content = req.body.content;
};

module.exports = Comment;