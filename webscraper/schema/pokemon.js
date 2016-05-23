var mongoose = require('mongoose');
//var _Location = require('./schema/location');

var pokemonSchema = {
  _id: { type: Number, required: true },
  indexNumber: {type: String, required: true},
  name: { type: String, required: true },
  imageUrl: { type: String, match: /^http:\/\//i },
  species: { type: String, required: true },
  pokemonType: {
    type: [String],
    enum: ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"]
  },
  measures: {
    height: {type: String, required: true },
    weight: {type: String, required: true }
  },
  description: { type: String, required: true },
  evoTree: {
    one: { _id: { type: String }, name: { type: String } },
    two: { _id: { type: String }, name: { type: String } },
    three: { _id: { type: String }, name: { type: String } },
  }
  //location: _Location.locationSchema
};
/****************** END ******************/

var schema = new mongoose.Schema(pokemonSchema);

var PokemonData = mongoose.model('PokemonData', schema, 'Pokemon');

module.exports = schema;
module.exports.PokemonData = PokemonData;
