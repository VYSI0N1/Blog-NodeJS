var express = require('express');
var router = express.Router();
var Medias = require('../controllers/Medias');
var middle = require('../middlewares/Security');


router.get('/', middle.session, Medias.index);

module.exports = router;