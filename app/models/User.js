var mongoose = require('mongoose');
const crypto = require('crypto');
const secret = /* clé de salt*/;

var UserSchema = mongoose.Schema({
    pseudo: String,
    lastname : String,
    firstname : String,
    email : String,
    password : String,
    rang: String,
    description: String,
    imageuser: String,
    token: String,
    tokenpwd: String,
    activated: Boolean,
    activatedAt: Date,
    createdAt : Date,
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.statics.crypt = function(a) {
    var a = new Promise(function(resolve, reject){
        crypto.pbkdf2(a, secret, 200000, 128, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('hex'));
        });
    });
    return a;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;