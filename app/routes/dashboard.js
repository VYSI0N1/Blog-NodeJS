var express = require('express');
var router = express.Router();
var Dashboards = require('../controllers/Dashboards');
var Users = require('../controllers/Users');
var middle = require('../middlewares/Security');

router.get('/', middle.auth, middle.session, Dashboards.index);

router.route('/login')
    .get(Dashboards.login)
    .post(Users.connection);

module.exports = router;
