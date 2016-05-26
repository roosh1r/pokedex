var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();

  api.get('/parent/id/:id', wagner.invoke(function(PokemonData) {
    return function(req, res) {
      //var query = (req.params.id < 10) ? '#00'+req.params.id : (req.params.id < 100) ? '#0'+req.params.id : '#'+req.params.id;
      PokemonData.
      findOne( { 'evolution._id' : req.params.id }, function(error, pokemon) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json( {error: error.toString() });
          }
          res.json({parent: pokemon.evolution.parent.name});
        });
    };
  }));
  api.get('/evolution/id/:id', wagner.invoke(function(PokemonData) {
    return function(req, res) {
      var query = (req.params.id < 10) ? '#00'+req.params.id : (req.params.id < 100) ? '#0'+req.params.id : '#'+req.params.id;
      PokemonData.
      find( {$or: [{ 'evolution.ancestor.index' : query }, { 'evolution.parent.index' : query }] }).
      sort( {_id: 1} ).
      exec( function(error, docs) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json( {error: error.toString() });
          }
          var nameList = [];
          _.each(docs, function(i){
            nameList.push(i.name);
          });
          res.json({evolutions: nameList});
        });
    };
  }));

  api.get('/pokemon/type/:type', wagner.invoke(function(PokemonData) {
    return function(req, res) {
      PokemonData.
      find( { pokemonType : req.params.type } ).
      sort( {_id: 1} ).
      exec( function(error, docs) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json( {error: error.toString() });
          }
          res.json({pokemon:docs});
        });
    };
  }));

  api.get('/pokemon/name/:name', wagner.invoke(function(PokemonData) {
    return function(req, res) {
      PokemonData.
      find( { name : { $regex: req.params.name, $options: 'i' } } ).
      sort( {_id: 1} ).
      exec( function(error, docs) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json( {error: error.toString() });
          }
          res.json({pokemon: docs});
        });
    };
  }));

  return api;
};
