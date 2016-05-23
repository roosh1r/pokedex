var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pokedex', function( error ) {
    if (error) { console.log('Error: ' + error ); }
    console.log('DB Connected');
  });

  var pokemonURL =
    mongoose.model('pokemonURL', require('../schema/pokemonURL'), 'pokemonURL');
  var PokemonData =
    mongoose.model('pokemonData', require('../schema/pokemon'), 'Pokemon');

  var dataModel = {
    pokemonURL: pokemonURL,
    PokemonData: PokemonData
  };

module.exports = dataModel;
