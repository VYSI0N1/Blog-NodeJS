var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
    name: String,
    desc: String,
    createdAt : Date,
    updatedAt: { type: Date, default: Date.now }
});

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;