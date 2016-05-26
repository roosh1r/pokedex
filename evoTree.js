var mongoose = require('mongoose');

var evoSchema = {
  _id: { type: Number, required: true },
  name: { type: String, required: true},
  parent: {
    index: { type: String, ref: 'evoTree'},
    name: { type: String, ref: 'evoTree'}
  },
  ancestor: [{
    index: { type: String, ref: 'evoTree'},
    name: { type: String, ref: 'evoTree'}
  }],

};

var schema = new mongoose.Schema(evoSchema);

module.exports = schema;
module.exports.evoSchema = evoSchema;
