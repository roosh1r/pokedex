var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/pokedex', function( error ) {
      if (error) { console.log('Error: ' + error ); }
      console.log('DB Connected');
    });

    var PokemonData =
      mongoose.model('pokemonData', require('./pokemon'), 'Pokemon');
    var evoTree =
      mongoose.model('evoTree', require('./evoTree'), 'evoTree');

    var models = {
      PokemonData: PokemonData,
      evoTree: evoTree
    };

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
