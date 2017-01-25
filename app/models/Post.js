var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    title: String,
    slug: String,
    preview: String,
    content: String,
    categories: [],
    tags: [],
    author: String,
    authorid: String,
    createdAt : Date,
    published: Boolean,
    img: String,
    updatedAt: { type: Date, default: Date.now }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;