var mongoose = require('mongoose');

var locationSchema = {
  _id: { type: String },
  parent: {
    type: String,
    ref: 'Location'
  },
  ancestors: [{
    type: String,
    ref: 'Location'
  }]
};

module.exports = new mongoose.Schema(locationSchema);
module.exports.locationSchema = locationSchema;
