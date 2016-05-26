var mongoose = require('mongoose');
var evoTree = require('./evoTree');

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
  evolution: evoTree.evoSchema
};
/****************** END ******************/

var schema = new mongoose.Schema(pokemonSchema);

var PokemonData = mongoose.model('PokemonData', schema, 'Pokemon');

module.exports = schema;
module.exports.PokemonData = PokemonData;
