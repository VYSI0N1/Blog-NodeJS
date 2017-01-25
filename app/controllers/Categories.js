var Category = require('../models/Category.js');

var Categories = {

    index: function (req, res) {
        Category.find({}, function (err, categories) {
            res.render('dashboard/posts/categories', {categories: categories})
        });
    },
    addcategory: function (req, res) {
        res.render('dashboard/posts/addcategory');
    },
    createcategory: function (req, res) {
        if (req.body.name.trim() && req.body.desc) {
            var C = new Category({
                name: req.body.name,
                desc: req.body.desc,
                createdAt: new Date()
            });
            Category.findOne({name: req.body.name.trim()}, function (err, category) {
                if (category) {
                    console.log('Une catégorie avec ce nom existe déjà');
                    res.redirect('/dashboard/posts/addcategory');
                } else {
                    C.save(function (err) {
                        if (err) {
                            console.log(err);
                            console.log('Il y a eu une erreur');
                            res.redirect('/dashboard/posts/addcategory');
                        } else {
                            console.log(C);
                            res.redirect('/dashboard/posts/categories');
                        }
                    });
                }
            });
        } else {
            console.log('Tous les champs n\'ont pas bien été renseignés');
        }
    },
    edit: function (req, res) {
        Category.findOne({_id: req.params.id}, function (err, category) {
            res.render('dashboard/posts/editcategory', {category: category})
        });
    }, 
    update: function (req, res){
        if (req.body.name && req.body.desc) {
            Category.findOneAndUpdate({_id: req.params.id}, {
                $set: {
                    name: req.body.name,
                    desc: req.body.desc,
                    updatedAt: new Date
                }
            }, {new: true}, function (err, category) {
                if (err) {
                    console.log("Erreur lors de l'update!");
                } else {
                    res.redirect('/dashboard/posts/categories');
                }
            });
        } else {
            console.log('Tous les champs ne sont pas renseignés!')
        }
    },
    delete: function (req, res) {
        Category.remove({_id : req.params.id}, function (err) {
            if (err) {
                console.log("Erreur lors de la suppression de l'article!");
            } else {
                res.redirect('/dashboard/posts/categories');
            }
        });
    }
};

module.exports = Categories;