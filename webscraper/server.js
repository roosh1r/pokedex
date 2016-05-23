var express = require('express');
var fs = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('underscore');
var mongoose = require('mongoose');
var model = require('./model');
var async = require('async');

var pokemonURL = model.pokemonURL;
var PokemonData = model.PokemonData;

var app = express();

app.get('/scrape', function(req, res) {
    // scraping happens here
    var proxyUrl = 'http://one.proxy.att.com:8080';

    BASE_URL = 'http://pokemondb.net/';
    url = BASE_URL + 'pokedex/national';
    var r = request.defaults({'proxy': proxyUrl});

    var options = {
        uri: BASE_URL+url,
        transform: function(body){
            return cheerio.load(body);
        }
    };
    r(options)
        .then( function($) {
            $('.infocard-tall ').slice(0, 151).filter(function() {
                var data = $(this);
                var pokeName = data.children('.ent-name').first().text();
                var linkName = data.children('.ent-name').first().attr('href');

                myUrl = BASE_URL + linkName.toLowerCase().replace(/^(\/\/)|^(\/)/g, '');

                var urlItem = new pokemonURL( {
                    name: pokeName,
                    url: myUrl
                });

                pokemonURL.find( {name: urlItem.name}, function (err, docs) {
                    if (docs.length) {
                        console.log( urlItem.name + ' already exists in the db');
                    } else {
                        urlItem.save( function (err) {
                            if (err) throw err;

                            console.log(urlItem.name + ' saved successfully');
                        });
                    }
                });
            });
        })
        .catch( function(err) {
            console.log(options.uri + ' - not scraped');
        });

    res.send('Check your console!');
});

app.get('/data', function(req, res) {

    var proxyUrl = 'http://one.proxy.att.com:8080';
    var r = request.defaults({'proxy': proxyUrl});

    String.prototype.allReplace = function(obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }
        return retStr;
    };

    var urlList = [];

    var crawlPage = function ( index, callback ) {
//        console.log('crawlPage invoked');
        var options = {
            //uri: list[index],
            uri: index,
            transform: function( body ){
                return cheerio.load(body);
            }
        };
        r( options )
            .then( function ($) {
                var name, _id, indexNumber, species, description, new_height, weight, imageUrl;

                var tree = {};

                var pokemonType = [];

                var basicData = function () {
                    _id = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(0, 1).text();
                    indexNumber = '#' + _id;
                    name = $('h1').first().text();
                    $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(1, 2).children('a').filter(function() {
                        var data = $(this);
                        pokemonType.push(data.text());
                    });
                    species = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();
                    var height = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(3, 4).text();
                    new_height = height.allReplace( { '\u2032' : "ft ", '\u2033': "in " } );
                    weight = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(4, 5).text();
                    imageUrl = $('div.figure').children('img').attr('src');
                    description = $('div#dex-flavor').siblings('table').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();
                };

                var evolution_data = function() {

                    var data = $('div.infocard-evo-list').children().not('.infocard-group').find('a.ent-name');
                    var first = data.slice(0, 1).text();
                    var first_id = data.slice(0, 1).siblings('small').not('.aside').text();
                    var second = data.slice(1, 2).text();
                    var second_id = data.slice(1, 2).siblings('small').not('.aside').text();
                    var third = data.slice(2,3).text();
                    var third_id = data.slice(2, 3).siblings('small').not('.aside').text();

                    if ( first_id ) { tree.one = { id: first_id, name: first}; }
                    if ( second_id) { tree.two = { id: second_id, name: second}; }
                    if (third_id) { tree.three = { id: third_id, name: third}; }
                };

                basicData();
                evolution_data();

                var PokemonEntry = new PokemonData( {
                    _id: Number(_id),
                    indexNumber: indexNumber,
                    name: name,
                    imageUrl: imageUrl,
                    species: species,
                    pokemonType: pokemonType,
                    measures: {
                        height: new_height,
                        weight: weight
                    },
                    description: description,
                    evoTree: tree
                });

                PokemonData.find( {name: PokemonEntry.name}, function (err, docs) {
                    if (docs.length) {
                        console.log( PokemonEntry.name + ' already exists in the db');
                    } else {
                        PokemonEntry.save( function (err) {
                            if (err) throw err;

                            console.log(PokemonEntry.name + ' data added');
                        });
                    }
                });

                var results = 'Done - ' + options.uri;
                callback(null, results);
            })
            .catch( function (err) {
                var results = 'Not scraped - ' + options.uri;
                callback(null, results);
            });
    };

    var asyncReqs = function ( list ) {
        var taskList = [];
        list.forEach(function(item){
            taskList.push( function(callback) {
                setTimeout(function() {
                    crawlPage(item, callback);
                }, 500);
            });
        });
        async.series(taskList, function (err, results) { console.log('Scraping completed'); });
    };

    pokemonURL.find( {} ).sort({ _id: 1 }).exec( function ( err, result ) {
        _.each(result, function (index) {
            urlList.push(index.url);
        });
        console.log('Starting scrapping....');
        asyncReqs(urlList);
    });

    res.send('Check your console for pokeman data!');
});

app.listen(8000);
console.log('Listening on port 8000');

exports = module.exports = app;
