let Comment= function (req, post_id) {
  this.post_id = post_id;
  this.username = req.session.username;
  this.content = req.body.content;
  this.time =  Date.now();
};

module.exports = Comment;