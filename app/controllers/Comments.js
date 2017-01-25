var Post = require('../models/Post.js');
var Comment = require('../models/Comment.js');

var Comments = {
    create: function (author, email, content, id, req, res) {
        if (author && email && content && id) {

            var C = new Comment({
                author: author,
                email: email,
                content: content,
                idpost: id,
                createdAt: new Date()
            });

            Post.findOne({_id: id}, function (err, post) {
                Comment.findOne({content: content, idpost: id}, function (err, comment) {
                    if (comment) {
                        console.log('Vous avez déjà publié ce commentaire');
                        res.redirect('/blog/' + post.slug)
                    } else {
                        C.save(function (err) {
                            if (err) {
                                console.log(err);
                                console.log('Il y a eu une erreur');
                                res.redirect('/blog/' + post.slug);
                            } else {
                                console.log(C);
                                //res.redirect('/blog/' + post.slug);

                            }
                        });
                    }
                });
            });
        } else {
            console.log('Problème avec les champs');
        }
    },
    update: function (req, res) {

    },

    delete: function (req, res) {
        Comment.findOne({_id: req.body._id}, function (err, comment) {
            comment.remove(); // voir si suffisant
            comment.save();
        });
    }
};

module.exports = Comments;