var Pages = {

    index: function(req, res){
        res.render('dashboard/pages/index');
    },
    add: function (req, res) {
        res.render('dashboard/pages/add');
    },
    addPages: function (req, res) {

    },
    edit: function (req, res) {
        Pages.findOne({_id: req.params.id}, function (err, pages) {
            res.render('dashboard/pages/edit', { pages: pages })
        });
    },
    update: function (req, res) {

    }
};

module.exports = Pages;