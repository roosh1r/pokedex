
                request(myUrl, function(error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);

                        var _id, indexNumber, name, species, height, weight, description, imageUrl;

                        var json = {
                            _id: "",
                            indexNumber: "",
                            name: "",
                            pokemonType: [],
                            species: "",
                            height: "",
                            weight: "",
                            description: "",
                            imageUrl: ""
                        };

                        _id = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(0, 1).text();
                        json._id = Number(_id);

                        indexNumber = '#' + _id;
                        json.indexNumber = indexNumber;

                        name = $('h1').first().text();
                        json.name = name;

                        var pokemonType = [];
                        $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(1, 2).children('a').filter(function() {
                            var data = $(this);
                            pokemonType.push(data.text());
                        });
                        json.pokemonType = pokemonType;

                        species = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();
                        json.species = species;

                        height = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(3, 4).text();
                        String.prototype.allReplace = function(obj) {
                            var retStr = this;
                            for (var x in obj) {
                                retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
                            }
                            return retStr;
                        };
                        var new_height = height.allReplace( { '\u2032' : "'", '\u2033': '"' } );
                        json.height = new_height;

                        weight = $('div#dex-basics').next('div').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(4, 5).text();
                        json.weight = weight;

                        imageUrl = $('div.figure').children('img').attr('src');
                        json.imageUrl = imageUrl;

                        description = $('div#dex-flavor').siblings('table').find('td', 'tr', 'tbody', 'table.vitals-table', 'div.tabset-basics').slice(2, 3).text();
                        json.description = description;


                        //console.log(JSON.stringify(json, null, 4));
                        if (json._id !== 0 && json.indexNumber !== "#") {
                            fs.appendFile('output.json', JSON.stringify(json), function(err) {
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                        else {
                            console.log(myUrl + " - Unable to resolve");
                        }

                    } else {
                        console.log('Error' + error);
                    }
                });
