var User = require('../models/User.js');
var Post = require('../models/Post.js');
var Category = require('../models/Category.js');
var Comment = require('../models/Comment.js');
var Notif = require('../controllers/Notifications');

var Indexes = {

    index: function(req, res){
        Post.find({published:true}, null, { sort :{ createdAt : -1}}, function (err, posts) {
            Comment.find().sort({_id: -1}).limit(2).exec(function(err, comments) {
                res.render('index', {posts: posts, comments: comments})
            });
        });
    },
    viewarticle: function (req, res) {
        var Slug = req.params.year + '/' + req.params.month + '/' + req.params.slug;

        Post.findOne({slug : Slug}, function(err, post){
            if (err) {
                next(err)
            } else if (post) {
                var tags = post.tags;
                console.log(tags);
                Post.findOne().sort({_id: -1}).limit(1).exec(function(err, next) {
                    Post.findOne().sort({_id: 1}).limit(1).exec(function(err, prev) {
                        Comment.find({idpost: post._id}, function (err, comments) {
                            Comment.find({idpost: post._id}).count(function(err, count) {
                                res.render('viewarticle', {
                                    user: req.session.user,
                                    post: post,
                                    tags: tags,
                                    prev: prev,
                                    next: next,
                                    comments: comments,
                                    count: count
                                });
                            });
                        });
                    });
                });
            } else {
                next(new Error('Failed to find blog post'));
                res.end();
            }
        });
    },
    apropos: function (req, res) {
        User.find({}, function (err, users){
            res.render('apropos', {users:users});
        });
    },
    contact: function (req, res) {
        res.render('contact');
    },
    traitementcontact: function (req, res) {
        if (req.body.email && req.body.pseudo && req.body.subject && req.body.content) {
            Notif.contact(req.body.email, req.body.pseudo, req.body.subject, req.body.content);
            res.redirect('/contact');
        } else {
            console.log('Erreur');
        }
    },
    category: function (req, res) {
        Category.find({name: req.params.id}, function (err, categories) {
            Post.find({categories:categories[0].name, published:true}, null, { sort :{ createdAt : -1}}, function (err, posts) {
                res.render('category', { posts: posts, categories:categories })
            });
        });
    },
    tags: function (req, res) {
        Post.find({tags: req.params.id}, null, { sort :{ createdAt : -1}}, function (err, posts) {
            res.render('tags', { posts: posts })
        });
    }
};

module.exports = Indexes;