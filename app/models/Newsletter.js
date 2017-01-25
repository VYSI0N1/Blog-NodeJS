var mongoose = require('mongoose');

var NewsletterSchema = mongoose.Schema({
    email: String,
    createdAt : Date
});

var Newsletter = mongoose.model('Newsletter', NewsletterSchema);

module.exports = Newsletter;