var express = require('express');
var router = express.Router();
var Pages = require('../controllers/Pages');

router.get('/', Pages.index);

router.route('/add')
    .get(Pages.add)
    .post(Pages.addPages);

router.route('/edit/:id(\\w+)')
    .get(Pages.edit)
    .post(Pages.update);

module.exports = router;