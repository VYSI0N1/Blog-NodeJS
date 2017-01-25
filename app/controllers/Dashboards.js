var User = require('../models/User.js');
var Post = require('../models/Post.js');
var Comment = require('../models/Comment.js');

var Dashboards = {

    index: function(req, res){
        User.findOne({_id: req.session.user._id}, function(err, user) {
            Post.find().count(function(err, count) {
                Comment.find().count(function(err, countCom) {
                    Post.find({}).sort({ createdAt : -1}).limit(5).exec(function (err, posts) {
                        Comment.find({}).sort({ createdAt : -1}).limit(5).exec(function (err, comments) {
                            res.render('dashboard/index', {
                                user: user,
                                count: count,
                                countCom: countCom,
                                posts: posts,
                                comments: comments
                            });
                        });
                    });
                });
            });
        });
    },
    login: function(req, res){
        res.render('dashboard/login');
    }
};

module.exports = Dashboards;