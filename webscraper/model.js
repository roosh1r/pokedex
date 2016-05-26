var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pokedex', function( error ) {
    if (error) { console.log('Error: ' + error ); }
    console.log('DB Connected');
  });

  var pokemonURL =
    mongoose.model('pokemonURL', require('./pokemonURL'), 'pokemonURL');
  var PokemonData =
    mongoose.model('pokemonData', require('./pokemon'), 'Pokemon');
  var evoTree =
    mongoose.model('evoTree', require('./evoTree'), 'evoTree');

  var dataModel = {
    pokemonURL: pokemonURL,
    PokemonData: PokemonData,
    evoTree: evoTree
  };

module.exports = dataModel;
