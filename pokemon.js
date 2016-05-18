var mongoose = require('mongoose');
var _Location = require('./schema/location');
var _ = require('underscore');

/********* One to One ******************/
var pokemonSchema = {
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  picture: { type: String, match: /^http:\/\//i },
  pokemon_type: {
    type: [String],
    enum: ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"]
  },
  evolution: {
    first: [ {type: String, required: true } ],
    second: [ {type: String } ],
    third: [ { type: String } ],
  },
  location: _Location.locationSchema
};
/****************** END ******************/

var schema = new mongoose.Schema(pokemonSchema);

schema.virtual('displayNeX').get(function() {
  return '#' + this._id;
});
