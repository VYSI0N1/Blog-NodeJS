var helper = require('sendgrid').mail;
var from_email = new helper.Email(/* email */);


var Notifications = {

    mail: function (pseudo, email, password, token) {

        var to_email = new helper.Email(email);
        var subject = 'Bienvenue sur Blog Xnov - Activez votre compte!';
        var content = new helper.Content('text/plain', 'Cliquez sur le lien suivant afin de valider votre ' +
            'compte dès maintenant! ' +
            'Lien : http://www.adrienferreira.me/dashboard/users/validate/' + email + '&&' + token +
            '. Votre identifiant est : ' + email + ' et votre mot de passe : ' + password +
            '. Pour plus de sécurité nous vous prions de changer de mot de passe dès lors que vous cliquez sur le lien' +
            'ci-dessus.');
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')(/* CLÉ API EMAIL */);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
    },
    newsletter: function (req, res) {
        
    },
    forgotpwd: function (email, tokenpwd) {

        var to_email = new helper.Email(email);
        var subject = 'Blog Xnov - Réinitialisez votre mot de passe!';
        var content = new helper.Content('text/plain', 'Cliquez sur le lien suivant afin de changer votre ' +
            'mot de passe dès maintenant! ' +
            'Lien : http://www.adrienferreira.me/dashboard/users/forgotpwd2/' + email + '&&' + tokenpwd );
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')(/* CLÉ API EMAIL */);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
    },
    contact: function (email, pseudo, objet, message) {
        var to_email = new helper.Email(/* email */);
        var subject = 'Blog Xnov - Nouveau message!';
        var content = new helper.Content('text/plain', 'Nouveau message de :' + email + ' -- ' + pseudo + '. L\'objet est : ' + objet + ' Le contenu du message est : ' + message );
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')(/* CLÉ API EMAIL */);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
    }
};

module.exports = Notifications;