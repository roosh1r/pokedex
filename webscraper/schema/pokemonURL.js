var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mySchema = new Schema( {
    name: { type: String, required: true },
    url: { type: String, required: true }
});

var urlList = mongoose.model('urlList', mySchema, 'pokemonURL');

module.exports = mySchema;
module.exports.urlList = urlList;
