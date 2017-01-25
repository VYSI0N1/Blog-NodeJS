var express = require('express');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'public' + Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });
var router = express.Router();
var Posts = require('../controllers/Posts');
var Categories = require('../controllers/Categories');
var Comments = require('../controllers/Comments');
var middle = require('../middlewares/Security');


/****** PUBLICATION ***********/
router.get('/', middle.session, Posts.index);

router.route('/add')
    .get(middle.auth, middle.session, Posts.add)
    .post(middle.auth, upload.single('file'), Posts.addPost);

router.get('/posts', middle.auth, middle.session, Posts.posts);

router.route('/edit/:id(\\w+)')
    .get(middle.auth, middle.session, Posts.edit)
    .post(middle.auth, upload.single('file'), Posts.update);

router.get('/delete/:id(\\w+)', middle.auth, middle.session, Posts.delete);

router.route('/draft')
    .get(middle.auth, upload.single('file'), middle.session, Posts.adddraftPost);



/********* CATÉGORIES *********/
router.get('/categories', middle.auth, middle.session, Categories.index);

router.route('/addcategory')
    .get(middle.auth, middle.session, Categories.addcategory)
    .post(middle.auth, Categories.createcategory);

router.route('/editcategory/:id(\\w+)')
    .get(middle.auth, middle.session, Categories.edit)
    .post(middle.auth, Categories.update);

router.get('/deletecategory/:id(\\w+)', middle.auth, Categories.delete);


/********** COMMENTAIRES *********/

router.post('/addcomment', Comments.create);



module.exports = router;