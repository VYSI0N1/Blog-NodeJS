var express = require('express');
var router = express.Router();
var Indexes = require('../controllers/Indexes');
var middle = require('../middlewares/Security');

router.get('/', Indexes.index);
router.get('/blog/:year/:month/:slug', Indexes.viewarticle);
router.get('/apropos', Indexes.apropos);
router.get('/contact', Indexes.contact);
router.post('/contact', Indexes.traitementcontact);

router.get('/categories/:id', Indexes.category);
router.get('/tags/:id', Indexes.tags);


module.exports = router;
