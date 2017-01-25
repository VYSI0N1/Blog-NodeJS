var express = require('express');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });
var router = express.Router();
var Users = require('../controllers/Users');
var middle = require('../middlewares/Security');

router.route('/')
    .get(middle.auth, middle.session, Users.index);

router.get('/showall', middle.auth, Users.showall);

router.route('/add')
    .get(middle.auth, middle.session, Users.add)
    .post(middle.auth, Users.subscribe);

router.route('/edit/:id(\\w+)')
    .get(middle.auth, middle.session, Users.edit)
    .post(middle.auth, Users.update);

router.post('/edit2/:id(\\w+)', middle.auth, middle.session, Users.update2);

router.get('/logout', middle.auth,  Users.logout);

router.get('/deleteAdmin/:id(\\w+)', middle.auth, Users.deleteAdmin);

router.get('/delete', middle.auth, Users.delete);

router.route('/profil')
    .get(middle.auth, middle.session, Users.profil);

router.post('/imageprofil/:id(\\w+)', upload.single('file'),  middle.auth, Users.imageprofil);


router.post('/description/:id(\\w+)', middle.auth, Users.description);

router.get('/validate/:email' + '&&' + ':token', Users.validate);

router.post('/newsletter', Users.newsletter);

router.route('/forgotpwd')
    .get(Users.displayforgotpwd)
    .post(Users.forgotpwd);

router.route('/forgotpwd2/:email' + '&&' + ':tokenpwd')
    .get(Users.forgotpwd2)
    .post(Users.changepwd);

module.exports = router;