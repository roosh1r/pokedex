var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
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
    r(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

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
        }
        else {
            console.log( response.statusCode + error);
        }
        //mongoose.connection.close();
    });

    res.send('Check your console!');

});

app.get('/data', function(req, res) {

    var proxyUrl = 'http://one.proxy.att.com:8080';
    var r = request.defaults({'proxy': proxyUrl});
    var rq = rp.defaults({'proxy': proxyURL });

    String.prototype.allReplace = function(obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }
        return retStr;
    };

    var urlList = [];

    var crawlPage = function ( list, index ) {
        var options = {
            uri: list[index],
            transform: function( body ){
                return cheerio.load(body);
            }
        };
        rq( options )
            .then( function ($) {
                console.log('Scraped - ' + options.uri);
            })
            .catch( function (err) {
                console.log('Not scraped - ' + options.uri);
            });
    };

    var asyncReqs =function ( list ) {
        var taskList = [];
        _.each(list, function (index) {
            var taskObj = {
                list: this,
                index: this.indexOf(index),
                task: function( callback ){
                    callback( this.list, this.index);
                }
            };
            taskList.push(taskObj);
        }, list);

        async.series(taskList, function (err, results) { console.log(results); });
    };

    pokemonURL.find( {} ).sort({ _id: 1 }).exec( function ( err, result ) {
        _.each(result, function (index) {
            urlList.push(index.url);
        });
        asyncReqs(urlList);
    });

/***
    pokemonURL.find( {} , function( err, item) {
        _.each(item, function( myDoc) {
            var myUrl = myDoc.url;
            r(myUrl, function(error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        var _id = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(0, 1).text();
                        var indexNumber = '#' + _id;
                        var name = $('h1').first().text();
                        var pokemonType = [];
                        $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(1, 2).children('a').filter(function() {
                            var data = $(this);
                            pokemonType.push(data.text());
                        });
                        var species = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();
                        var height = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(3, 4).text();
                        var new_height = height.allReplace( { '\u2032' : "ft ", '\u2033': "in " } );
                        var weight = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(4, 5).text();
                        var imageUrl = $('div.figure').children('img').attr('src');
                        var description = $('div#dex-flavor').siblings('table').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();

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
                            description: description
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
                    }
                    else {
                        console.log( response.statusCode + error);
                    }
                //mongoose.connection.close();

            });

        });
    });
***/
    res.send('Check your console for pokeman data!');
});

app.listen(8000);
console.log('Listening on port 8000');

exports = module.exports = app;
