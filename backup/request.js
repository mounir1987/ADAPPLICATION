request('http://www.ouedkniss.com/telephones', function (error, response, html) {
        
            if (!error && response.statusCode == 200) {
                
                var $ = cheerio.load(html);
                $('div', '#divData').each(function(i, element){
                    var id_annonce = $(this).attr('id');
                    var href = $('a' ,'li[class=bouton_details]', this).attr('href');
                    if(href && id_annonce){
                        if(href === 'undefined' || id_annonce === 'adcontainer1' || id_annonce === 'divPages' || id_annonce === 'undefined'){
                        }else{
                            j++;
                            //var json = getInformation('http://www.ouedkniss.com/'+href, j);

                            getInformation('http://www.ouedkniss.com/'+href, j).then(function(result){
                                //console.log('here is your result',result);

                                console.log('%s ',result['annonce']['date_time']);
                                console.log(moment(telephones[0].annonce.date_time).isBefore(result['annonce']['date_time']));

                                if(moment(telephones[0].annonce.date_time).isBefore(result['annonce']['date_time'])){
                                    
                                        var tel = new Telephone({
                                            _id:      result['id'],
                                            annonce:      result['annonce'],
                                            annonceur:    result['annonceur']
                                        });

                                        tel.save(function (err, data) {
                                            if (err) console.log(err);
                                            else console.log('Saved : ', data );
                                        });
                                    
                                }
                                
                            });

                        }    
                    }
                });
                res.send(html);
            }  
        });