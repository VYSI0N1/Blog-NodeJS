var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
    author : String,
    email : String,
    content : String,
    idpost: String,
    createdAt : Date,
    updatedAt : { type : Date, default: Date.now}
});


var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;