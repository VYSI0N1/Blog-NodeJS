let Security = {

    auth: function (req, res, next) {
        if (!req.session.connected) {
            return res.redirect('/dashboard/login');
        }
        next();
    },
    session: function (req, res, next) {
        if (req.session.user.connected) {
            res.locals.session = req.session.user.rang;
        }
        next();
    }
};

module.exports = Security;