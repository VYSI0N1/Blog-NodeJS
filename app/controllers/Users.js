var User = require('../models/User.js');
var Newsletter = require('../models/Newsletter.js');
var Notif = require('../controllers/Notifications');
var rand = function() {
    return Math.random().toString(36).substr(2);
};

var token = function() {
    return rand() + rand();
};


var Users = {

    index: function (req, res) {
        User.find({}, function (err, users) {
            res.render('dashboard/users/', { users: users })
        });
    },
    add: function (req, res) {
        res.render('dashboard/users/add');
    },
    subscribe: function (req, res) {
        if (req.body.pseudo.trim() && req.body.lastname.trim() && req.body.firstname.trim() &&
            req.body.email.trim() && req.body.password.trim() && req.body.typeaccount.trim()) {
            var activatetoken = token();
            User.crypt(req.body.password.trim()).then((pwd) => {
                var U = new User({
                    pseudo: req.body.pseudo.trim(),
                    lastname: req.body.lastname.trim(),
                    firstname: req.body.firstname.trim(),
                    email: req.body.email.trim(),
                    password: pwd,
                    rang: req.body.typeaccount.trim(),
                    token: activatetoken,
                    activated: false,
                    createdAt: new Date()
                });
                User.findOne({email: req.body.email.trim()}, function (err, email) {
                    if (email) {
                        console.log('Un utilisateur avec cet adresse email existe déjà');
                        res.redirect('/dashboard/users/add');
                    } else {
                        U.save(function (err) {
                            if (err) {
                                console.log(err);
                                console.log('Il y a eu une erreur');
                                res.redirect('/dashboard/users/add');
                            } else {
                                console.log(U);
                                Notif.mail(U.pseudo, U.email, req.body.password, U.token);
                                res.redirect('/dashboard/users/');
                            }
                        });
                    }
                });
            })
        } else {
            console.log('Tous les champs n\'ont pas bien été renseignés');
        }
    },
    connection: function (req, res) {
        if (req.body.email.trim() && req.body.password.trim()) {
            User.crypt(req.body.password).then(function (pwd) {
                User.findOne({email: req.body.email, password: pwd}, function (err, user) {
                    console.log(user);
                    if (user) {
                        req.session.connected = true;
                        req.session.user = user;
                        req.session.user.password = null;
                        req.session.user.notif = req.toastr.success('Successfully logged in.', "You're in!");
                        res.redirect('/dashboard/');
                    } else {
                        console.log('L\'identifiant ou le mot de passe est incorrect.');
                        res.redirect('/dashboard/login');
                    }
                });
            });
        } else {
            console.log('Tous les champs n\'ont pas été bien renseignés');
            res.redirect('/dashboard/login');
        }

    },
    edit: function (req, res) {
        User.findOne({_id: req.params.id}, function (err, user) {
            res.render('dashboard/users/edit', { user: user })
        });
    },
    update: function (req, res) {
        if (req.body.pseudo.trim() && req.body.lastname.trim() && req.body.firstname.trim() &&
            req.body.email.trim() && req.body.password.trim() && req.body.typeaccount.trim()) {
            User.crypt(req.body.password.trim()).then((pwd) => {
                User.findOneAndUpdate({_id: req.params.id}, {$set: {
                    pseudo: req.body.pseudo.trim(),
                    lastname: req.body.lastname.trim(),
                    firstname: req.body.firstname.trim(),
                    email: req.body.email.trim(),
                    password: pwd,
                    rang: req.body.typeaccount.trim(),
                    updatedAt: new Date
                }}, {new: true}, function (err, user) {
                    if (err) {
                        console.log("Erreur lors de l'update!");
                    } else {
                        res.redirect('/dashboard/users/');
                    }
                });
            })
        } else {
            console.log('Tous les champs n\'ont pas bien été renseignés');
            res.redirect('/dashboard/users/edit/' + req.params.id);
        }
    },
    update2: function (req, res) {
        if (req.body.pseudo.trim() && req.body.lastname.trim() && req.body.firstname.trim() &&
            req.body.email.trim() && req.body.password.trim() && req.body.typeaccount.trim()) {
            User.crypt(req.body.password.trim()).then((pwd) => {
                User.findOneAndUpdate({_id: req.params.id}, {$set: {
                    pseudo: req.body.pseudo.trim(),
                    lastname: req.body.lastname.trim(),
                    firstname: req.body.firstname.trim(),
                    email: req.body.email.trim(),
                    password: pwd,
                    rang: req.body.typeaccount.trim(),
                    updatedAt: new Date
                }}, {new: true}, function (err, user) {
                    if (err) {
                        console.log("Erreur lors de l'update!");
                    } else {
                        req.session.user = user;
                        req.session.user.password = null;
                        res.redirect('/dashboard/users/profil');
                    }
                });
            })
        } else {
            console.log('Tous les champs n\'ont pas bien été renseignés');
            res.redirect('/dashboard/users/edit/' + req.params.id);
        }
    },
    description: function (req, res) {
        if (req.body.description) {
            User.findOneAndUpdate({_id: req.params.id}, {$set: {
                description: req.body.description,
                updatedAt: new Date
            }}, {new: true}, function (err, doc) {
                if (err) {
                    console.log("Erreur lors de l'update!");
                } else {
                    res.redirect('/dashboard/users/profil');
                }
            });
        } else {
            console.log('La description n\'est pas renseignée.');
        }
    },
    deleteAdmin: function (req, res) {
        User.remove({_id : req.params.id}, function (err) {
            if (err) {
                console.log("Erreur lors de la suppression du compte!");
            } else {
                console.log('L\'utilisateur a bien été supprimé.');
                res.redirect('/dashboard/users/');
            }
        });
    },
    delete: function (req, res) {
        User.remove({_id : req.session._id}, function (err) {
            if (err) {
                console.log("Erreur lors de la suppression du compte!");
            } else {
                req.session.destroy(function () {
                    res.clearCookie('connect.sid', {path: '/'});
                    res.redirect('/');
                });
            }
        });
    },
    logout: function (req, res) {
        req.session.destroy(function () {
            res.clearCookie('connect.sid', {path: '/'});
            res.redirect('/');
        });
    },
    profil: function (req, res) {
        User.findOne({_id: req.session.user._id}, function(err, user) {
            res.render('dashboard/users/profil', { user: user })
        });
    },
    imageprofil: function (req, res) {
        if (req.file.filename) {
            User.findOneAndUpdate({_id: req.session.user._id}, {$set: {
                imageuser: req.file.filename,
                updatedAt: new Date
            }}, {new: true}, function (err) {
                if (err) {
                    console.log("Erreur lors de l'update!");
                } else {
                    res.redirect('/dashboard/users/profil');
                }
            });
        } else {
            console.log('Tous les champs n\'ont pas bien été renseignés');
            res.redirect('/dashboard/users/profil');
        }
    },
    validate: function (req, res) {
        User.findOneAndUpdate({email: req.params.email, token: req.params.token}, {$set: {
            token: null,
            activated: true,
            activatedAt: new Date,
            updatedAt: new Date
        }}, {new: true}, function (err, user) {
            if (err) {
                console.log("Erreur lors de l'update!");
            } else {
                req.session.connected = true;
                req.session.user = user;
                req.session.user.password = null;
                res.redirect('/dashboard/users/profil');
            }
        });
    },
    displayforgotpwd: function (req, res) {
        res.render('dashboard/forgotpwd');
    },
    forgotpwd: function (req, res) {
        var tokenpwd = token();

        User.findOneAndUpdate({email: req.body.email}, {$set: {
            tokenpwd: tokenpwd,
            updatedAt: new Date
        }}, {new: true}, function (err, user) {
            if (err) {
                console.log("Erreur lors de l'update!");
            } else {
                console.log(user);
                Notif.forgotpwd(user.email, tokenpwd);
                res.redirect('/dashboard/login/');
            }
        });
    },
    forgotpwd2: function (req, res) {
        User.findOne({email: req.params.email, tokenpwd:req.params.tokenpwd}, function (err, user) {
            res.render('dashboard/newpwd', {email: req.params.email, tokenpwd: req.params.tokenpwd});
        });

    },
    changepwd: function (req, res) {
        if (req.body.email && req.body.tokenpwd && req.body.pwd) {
            User.crypt(req.body.pwd.trim()).then((pwd) => {
                User.findOneAndUpdate({email: req.body.email, tokenpwd: req.body.tokenpwd}, {$set: {
                    tokenpwd: null,
                    password : pwd,
                    updatedAt: new Date
                }}, {new: true}, function (err, user) {
                    if (err) {
                        console.log("Erreur lors de l'update!");
                    } else {
                        console.log(user);
                        res.redirect('/dashboard/login/');
                    }
                });
            });
        } else {
            console.log('Erreur');
        }
    },
    showall: function (req, res) {
        User.find({}, (err, users)=> {
            res.json(users);
        });
    },
    newsletter: function (req, res) {
        if (req.body.email){
            var N = new Newsletter({
                email: req.body.email,
                createdAt: new Date()
            });
            Newsletter.findOne({email: req.body.email.trim()}, function (err, email) {
                if (email) {
                    console.log('Un utilisateur avec cet adresse email existe déjà');
                    res.redirect('/');
                } else {
                    N.save(function (err) {
                        if (err) {
                            console.log(err);
                            console.log('Il y a eu une erreur');
                            res.redirect('/');
                        } else {
                            console.log(N);
                            res.redirect('/');
                        }
                    });
                }
            });
        } else {
            console.log('Mail erroné');
        }
    }
};

module.exports = Users;