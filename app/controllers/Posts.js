var moment = require('moment');
var Post = require('../models/Post.js');
var Categories = require('../models/Category.js');
var User = require('../models/User.js');

var Posts = {

    index: function(req, res){
        Post.find({published:true}, function (err, posts) {
            res.render('dashboard/posts/', { posts: posts})
        });
    },
    posts: function (req, res) {
        Post.find({authorid: req.session.user._id}, function (err, posts) {
            res.render('dashboard/posts/posts', { posts: posts })
        });
    },
    add: function (req, res) {
        Categories.find({}, function (err, categories) {
            res.render('dashboard/posts/add', { categories:categories })
        });
    },
    addPost: function (req, res) {
        if (req.body.title && req.body.content && req.body.categories && req.body.tags && req.file) {
            var categories = req.body.categories;
            var tagsOr = req.body.tags;
            var tags = tagsOr.split(',');

            function slugify(text) {

                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')        // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                    .replace(/^-+/, '')          // Trim - from start of text
                    .replace(/-+$/, '');         // Trim - from end of text
            }
            var slug = slugify(req.body.title);
            var date = moment(this.date), formattedslug = date.format('YYYY[/]MM[/]') + slug;
            var Preview = req.body.content.substr(0, 400);
            
            if (req.body.optionsRadios === 'oui'){
                var draft = false;
            } else {
                draft = true;
            }

            var P = new Post({
                title: req.body.title,
                slug : formattedslug,
                preview: Preview,
                content: req.body.content,
                categories: categories,
                tags: tags,
                author: req.session.user.pseudo,
                authorid: req.session.user._id,
                img: req.file.filename,
                published: draft,
                createdAt: new Date()
            });
            Post.findOne({title: req.body.title}, function (err, title) {
                if (title) {
                    console.log('Un article avec ce titre existe déjà');
                    res.redirect('/dashboard/posts/add');
                } else {
                    P.save(function (err) {
                        if (err) {
                            console.log(err);
                            console.log('Il y a eu une erreur');
                            res.redirect('/dashboard/posts/add');
                        } else {
                            console.log(P);
                            req.toastr.success('Article publié', "Aller voir ça directement");
                            res.redirect('/dashboard/posts/');
                        }
                    });
                }
            });
        } else {
            console.log('Tous les champs ne sont pas renseignés!')
        }
    },
    adddraftPost: function (req, res) {
        Post.find({published: false}, function (err, posts) {
            res.render('dashboard/posts/draft', { posts: posts })
        });
    },
    edit: function (req, res) {
        Post.findOne({_id: req.params.id}, function (err, post) {
            console.log(post);
            var tags = post.tags.toString();
            var cats = post.categories.toString();

            res.render('dashboard/posts/edit', { post: post, tags:tags, cats:cats })
        });
    },
    update: function (req, res) {
        if (req.body.title && req.body.content && req.body.categories && req.body.tags) {
            var categories = req.body.categories;
            var tagsOr = req.body.tags;
            var tags = tagsOr.split(',');

            function slugify(text) {

                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')        // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                    .replace(/^-+/, '')          // Trim - from start of text
                    .replace(/-+$/, '');         // Trim - from end of text
            }

            var slug = slugify(req.body.title);
            var date = moment(this.date), formattedslug = date.format('YYYY[/]MM[/]') + slug;
            var Preview = req.body.content.substr(0, 400);

            if (req.body.optionsRadios === 'oui') {
                var draft = false;
            } else {
                draft = true;
            }

            Post.findOne({_id: req.params.id}, function (err, post){
                console.log(post);
                console.log(req.file);
                if(req.file) {
                    var img = req.file.filename;
                } else {
                    img = post.img;
                }

                Post.findOneAndUpdate({_id: req.params.id}, {
                    $set: {
                        title: req.body.title,
                        slug: formattedslug,
                        preview: Preview,
                        content: req.body.content,
                        categories: categories,
                        tags: tags,
                        img: img,
                        published: draft,
                        updatedAt: new Date
                    }
                }, {new: true}, function (err, post) {
                    if (err) {
                        console.log("Erreur lors de l'update!");
                    } else {
                        if (post.author == req.session.user.pseudo) {
                            res.redirect('/dashboard/posts/posts');
                        } else {
                            res.redirect('/dashboard/posts/');
                        }
                    }
                });
            });
        } else {
            console.log('Tous les champs ne sont pas renseignés!')
        }
    },
    delete: function (req, res) {
        Post.find({_id : req.params.id}, function (err, post) {
            if(post[0].author == req.session.user.pseudo){
                Post.remove({_id : req.params.id}, function (err) {
                    if (err) {
                        console.log("Erreur lors de la suppression de l'article!");
                    } else {
                        res.redirect('/dashboard/posts/posts');
                    }
                });
            } else {
                Post.remove({_id : req.params.id}, function (err) {
                    if (err) {
                        console.log("Erreur lors de la suppression de l'article!");
                    } else {
                        res.redirect('/dashboard/posts/');
                    }
                });
            }
        });

    }
};

module.exports = Posts;