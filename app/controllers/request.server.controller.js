/*
** Server controller : index.server.controller.js
**
** Achat-vente  Back-end
** ballot_g
*/

var request = require('request');
var cheerio = require('cheerio');
var httpreq = require('httpreq');
var fs = require('fs'); 
var Promise = require('promise-simple');
var moment = require('moment');

var mongoose = require('mongoose');
var Telephone = mongoose.model('Telephone');

var j=0;

exports.getTelephones = function(req, res) {

    Telephone.
      find({ }).
      limit(1).
      sort('-annonce.date_time').
      select('id annonce.numero annonce.date_time').
      exec( function (err, telephones) {
        if (err) return handleError(err);
        var userMap = {};
        if(telephones.length !== 0){
            console.log('request %s ', telephones[0].annonce.date_time);
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

                                    if(moment(telephones[0].annonce.date_time).isBefore(result['annonce']['date_time'])){
                                        
                                            var tel = new Telephone({
                                                //_id:      result['annonce']['numero'],
                                                annonce:      result['annonce'],
                                                annonceur:    result['annonceur']
                                            });

                                            tel.save(function (err, data) {
                                                if (err) console.log(err);
                                                else console.log('Saved : '/*, data */);
                                            });
                                        
                                    }else{
                                        console.log("ad already saved !");
                                    }
                                    
                                });

                            }    
                        }
                    });
                    res.send(html);
                }  
            });
        }else{
            console.log('diferent de 0');
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
                                    
                                        
                                    var tel = new Telephone({
                                        //_id:      result['annonce']['numero'],
                                        annonce:      result['annonce'],
                                        annonceur:    result['annonceur']
                                    });

                                    tel.save(function (err, data) {
                                        if (err) console.log(err);
                                        else console.log('Saved : '/*, data */);
                                    });
                                        
                                    
                                    
                                });

                            }    
                        }
                    });
                    res.send(html);
                }  
            });
        }
        

    });
};

function getInformation (link, iteration) {
    //console.log(link);
    var result = {};
    var json= Promise.defer();
    //var json= {};

    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {

          var $ = cheerio.load(html);
          
          var annonce = $('#annonce');
          var annonceur = $('#Annonceur');

          // get annonce information 
          result['id'] = iteration;

          result['annonce'] = getAnnonce($, annonce, iteration);
          result['annonceur'] = getAnnonceur($, annonce);  

          json.resolve(result);

        }
    });
    //console.log(json);
    return json;
}

var getAnnonce = function ($, annonce, i) {
    
    var title = $('h1[id=Title]', annonce).text();
    //console.log(i+"--- "+title);

    var numero_text = $('a[class=numero]', '#Description', annonce).html();
    if(numero_text !== null){
        var numero = $('div[id=Description] a[class=numero] span').text();
    }else{
        var numero = "";
    }
    //console.log('numero'+" "+numero+"\n");

    var nbr_view_text = $('p', '#Description', annonce).eq(1).text();
    //console.log('nombre de vue'+" "+nbr_view+"\n");
    var nbr_view_parts = nbr_view_text.split(':');
    if(nbr_view_parts[1]){
        var nbr_view = nbr_view_parts[1].replace(' ', '');
    }else{
        var nbr_view = ""
    }

    var date_formated = {};
    var date_text = $('p', '#Description', annonce).eq(2);
    if(date_text !== null){
        var date_brute = $('span' ,date_text).text();

        date_parts = date_brute.split("à");

        date_parts1 = date_parts[0].replace(" ","");
        date_parts2 = date_parts[1].replace(" ","");

        arr_day_month_year = date_parts1.split("-");
        date_formated = arr_day_month_year[2]+ '-' + arr_day_month_year[1] + '-' + arr_day_month_year[0];

        var date_string = date_formated + " " + date_parts2;
        var day = moment(date_string).locale('fr');
        date_time = day['_d'];
    }
    
    //console.log('date de depot'+" "+date_time+"\n");

    var category_text = $('p', '#Description', annonce).eq(3);
    var category = $('span' ,category_text).text();
    //console.log('categorie '+" "+category+"\n");

    var color_text = $('p[id=Couleur]', '#Description', annonce);
    var color = $('span' ,color_text).text();
    //console.log('couleur '+" "+color+"\n");

    var state_text = $('p[id=Etat]', '#Description', annonce);
    var state = $('span' ,state_text).text();
    //console.log('etat '+" "+state+"\n");

    var description = $('div[id=GetDescription]', '#Description', annonce).html();
    //console.log('description '+" "+description+"\n");

    var price_text = $('p[id=Prix]', '#espace_prix', annonce);
    if(price_text.length !== 0){
      var price_brute = $('span' ,price_text).text();
      var price_parts = price_brute.split(' ');
      var price = price_parts[0];
      //console.log('prix '+" "+price+"\n");
    }else{
      var price = "";
      //console.log('prix non mentionne'+"\n");
    }
    var fichetechnique_text = $('#telephone', annonce).html();
    if(fichetechnique_text !== null){
      var fiche_technique = fichetechnique_text;
      //console.log('fiche_technique '+" "+fiche_technique+"\n");
    }else{
      var fiche_technique = "";
      //console.log('fiche_technique non mentionne'+"\n");
    }

    var gallery = $('div[id=annonce] div[id=gallery] a').html();
    var gallery_text = $('a','#gallery', annonce);
    var pictures = {};

    if(gallery){
      $(gallery_text).each(function(k, element){

        if(k !== 10){

          var image = $('img' ,element).attr('style');
          var limit = image.length - 1;
          var src = image.substring(21, limit);

          var e = src.split("/");   
          var dir = __dirname + '/../../' + 'public' + '/' + 'img';
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }
          var path = 'telephones';
          dir = dir + '/telephones';
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }
          var date = moment();
          var year = date.get('year');

          path = path + '/' + year;
          dir = dir + '/' + year;
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          var month = date.get('month');

          path = path + '/' + month;
          dir = dir + '/' + month;
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          var day = date.get('date');

          path = path + '/' + day;
          dir = dir + '/' + day;
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          path = path + '/' + i + "-" + e[4];
          dir = dir + '/' + i + "-" + e[4];
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }
          pictures[k] = path + '/' + e[5];
          //console.log(i + "  " + e[4] + '/' + e[5] + "\n");
          httpreq.get(src, {binary: true}, function (err, res){
              if (err){
                  console.log(err);
              }else{
                //console.log(src);
                fs.writeFile( dir + '/' + e[5], res.body, function (err) {
                    if(err)
                        console.log("error writing file");
                });
                
              }
          });
          
        }
       
      });
        //console.log('image mentionne'+"\n");
    }else{
             //console.log('image non mentionne'+"\n");
      pictures['empty'] = "";
    }

    var json = { 
        title : title,
        numero : numero,
        nbr_view : nbr_view,
        date_time : date_time,
        category : category,
        color : color,
        state : state,
        description : description,
        price : price,
        fiche_technique: fiche_technique,
        pictures : pictures,
      };
      
    return json;
};

function getAnnonceur ($, annonce) {
    var store = $('div[id=Annonceur] a[id=store]').html();

    var numero_text = $('a[class=numero]', '#Description', annonce).html();
    if(numero_text !== null){
        var numero = $('div[id=Description] a[class=numero] span').text();
    }else{
        var numero = "";
    }

    
    var annonceurInfo = {};
    var contact_information = {};
    var type = "";

    if(store !== null){

        store_id_text = $('div[id=Annonceur] a[id=store]').attr('href');
        var parts = store_id_text.split('?');

        id = parts[1].split('id=');
        annonceurInfo["store_id"] = id[1];
        annonceurInfo["type"] = "pro";
        var store_id = id[1];
        type = "pro";

        store_name = $('span[id=store_name]').text();
        if(store_name.length !== 0){   
            annonceurInfo["store_name"] = store_name;
        }else{ 
            annonceurInfo["store_name"] = "";
        }
        store_activite = $('span[id=store_activite]').text();
        if(store_activite.length !== 0){ 
            annonceurInfo["store_activite"] = store_activite; 
        }else{ 
            annonceurInfo["store_activite"] = "";
        }
        store_adresse = $('span[id=store_adresse]').text(); 
        if(store_adresse.length !== 0){ 
            annonceurInfo["store_adresse"] = store_adresse; 
        }else{ 
            annonceurInfo["store_adresse"] = "";
        }

        contact_text = $('div[id=Annonceur] div').html();

        if(contact_text !== null){
            phone_text = $('div[id=Annonceur] div p[class=Phone]').html();
            if(phone_text !== null){
                  phone = $('div[id=Annonceur] div p[class=Phone] img').attr('src');
                  annonceurInfo["phone"] = phone;

                  var nom = "phone.jpg";
                  var dir = __dirname + '/../../' + 'public' + '/' + 'img';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var path_phone = 'telephones';
                  dir = dir + '/telephones';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var date = moment();
                  var year = date.get('year');

                  path_phone = path_phone + '/' + year;
                  dir = dir + '/' + year;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var month = date.get('month');

                  path_phone = path_phone + '/' + month;
                  dir = dir + '/' + month;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var day = date.get('date');

                  path_phone = path_phone + '/' + day;
                  dir = dir + '/' + day;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_phone = path_phone + '/'  + numero;
                  dir = dir + '/'  + numero;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_phone = path_phone + '/contact';
                  dir = dir + '/contact';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  //console.log(i + "  " + e[4] + '/' + e[5] + "\n");
                  httpreq.get(phone, {binary: true}, function (err, res){
                      if (err){
                          console.log(err);
                      }else{
                        //console.log(src);
                        fs.writeFile( dir + '/' + nom, res.body, function (err) {
                            if(err)
                                console.log("error writing file");
                        });

                        annonceurInfo["path_phone"] = path_phone;
                        
                      }
                  });
                
            }else{
                annonceurInfo["phone"] = "";
                annonceurInfo["path_phone"] = "";
            }

            mail_text = $('div[id=Annonceur] div p[class=Email]').html();
            if(mail_text !== null){
              mail = $('div[id=Annonceur] div p[class=Email] img').attr('src');
              annonceurInfo["mail"] = mail; 

                var nom = "mail.jpg";
                  var dir = __dirname + '/../../' + 'public' + '/' + 'img';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var path_mail = 'telephones';
                  dir = dir + '/telephones';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var date = moment();
                  var year = date.get('year');

                  path_mail = path_mail + '/' + year;
                  dir = dir + '/' + year;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var month = date.get('month');

                  path_mail = path_mail + '/' + month;
                  dir = dir + '/' + month;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var day = date.get('date');

                  path_mail = path_mail + '/' + day;
                  dir = dir + '/' + day;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_mail = path_mail + '/'  + numero;
                  dir = dir + '/'  + numero;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_mail = path_mail + '/contact';
                  dir = dir + '/contact';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  //console.log(i + "  " + e[4] + '/' + e[5] + "\n");
                  httpreq.get(mail, {binary: true}, function (err, res){
                      if (err){
                          console.log(err);
                      }else{
                        //console.log(src);
                        fs.writeFile( dir + '/' + nom, res.body, function (err) {
                            if(err)
                                console.log("error writing file");
                        });

                        annonceurInfo["path_mail"] = path_mail;
                        
                      }
                  });

            }else{
                annonceurInfo["mail"] = "";
            }
        }

    }else{
        annonceurInfo["type"] = "beginner";
        type = "beginner";

        pseudo_text = $('div[id=Annonceur] p[class=Pseudo]').html();
        if(pseudo_text !== null){
            pseudo = $('div[id=Annonceur] p[class=Pseudo] a').text();
            annonceurInfo["pseudo"] = pseudo; 
        }else{ 
            annonceurInfo["pseudo"] = "";
        }

        adress_text = $('div[id=Annonceur] p[class=Adresse]').text();
        if(adress_text.length !== 0){
            adress = $('div[id=Annonceur] p[class=Adresse]').text();
            annonceurInfo["adress"] = adress; 
        }else{ 
            annonceurInfo["adress"] = "";
        }

        contact_text = $('div[id=Annonceur] div').html();
        if(contact_text !== null){
            phone_text = $('div[id=Annonceur] div p[class=Phone]').html();
            if(phone_text !== null){
                phone = $('div[id=Annonceur] div p[class=Phone] img').attr('src');
                annonceurInfo["phone"] = phone;

                var nom = "phone.jpg";
                  var dir = __dirname + '/../../' + 'public' + '/' + 'img';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var path_phone = 'telephones';
                  dir = dir + '/telephones';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var date = moment();
                  var year = date.get('year');

                  path_phone = path_phone + '/' + year;
                  dir = dir + '/' + year;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var month = date.get('month');

                  path_phone = path_phone + '/' + month;
                  dir = dir + '/' + month;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var day = date.get('date');

                  path_phone = path_phone + '/' + day;
                  dir = dir + '/' + day;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_phone = path_phone + '/'  + numero;
                  dir = dir + '/'  + numero;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_phone = path_phone + '/contact';
                  dir = dir + '/contact';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  //console.log(i + "  " + e[4] + '/' + e[5] + "\n");
                  httpreq.get(phone, {binary: true}, function (err, res){
                      if (err){
                          console.log(err);
                      }else{
                        //console.log(src);
                        fs.writeFile( dir + '/' + nom, res.body, function (err) {
                            if(err)
                                console.log("error writing file");
                        });

                        annonceurInfo["path_phone"] = path_phone;
                        
                      }
                  });
            }else{
                annonceurInfo["phone"] = "";
                annonceurInfo["path_phone"] = "";
            }

            mail_text = $('div[id=Annonceur] div p[class=Email]').html();
            if(mail_text !== null){
                var mail = $('div[id=Annonceur] div p[class=Email] img').attr('src');
                annonceurInfo["mail"] = mail; 

                var nom = "mail.jpg";
                  var dir = __dirname + '/../../' + 'public' + '/' + 'img';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var path_mail = 'telephones';
                  dir = dir + '/telephones';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }
                  var date = moment();
                  var year = date.get('year');

                  path_mail = path_mail + '/' + year;
                  dir = dir + '/' + year;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var month = date.get('month');

                  path_mail = path_mail + '/' + month;
                  dir = dir + '/' + month;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  var day = date.get('date');

                  path_mail = path_mail + '/' + day;
                  dir = dir + '/' + day;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_mail = path_mail + '/'  + numero;
                  dir = dir + '/'  + numero;
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  path_mail = path_mail + '/contact';
                  dir = dir + '/contact';
                  if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                  }

                  //console.log(i + "  " + e[4] + '/' + e[5] + "\n");
                  httpreq.get(mail, {binary: true}, function (err, res){
                      if (err){
                          console.log(err);
                      }else{
                        //console.log(src);
                        fs.writeFile( dir + '/' + nom, res.body, function (err) {
                            if(err)
                                console.log("error writing file");
                        });

                        annonceurInfo["path_mail"] = path_mail;
                        
                      }
                  });

            }else{
                annonceurInfo["mail"] = "";
                annonceurInfo["path_mail"] = "";
            }
  
        }
      
    }
    

    return annonceurInfo;
}


var getInformationFromContactPage = function (link) {
    
    var informations_contact = {};
    var info_contact = Promise.defer();

    console.log("link : " +link);
    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var node = $('p', '#informations').html();

            if(node !== null){
                $('p', '#informations').each(function(i, element){
                    
                    k = $('label',element).text();
                    k = k.replace(":","");

                    informations = $('span',element).text();
                    informations = informations.replace(" ","");
                    informations = informations.replace("---","");
                    informations = informations.replace(/\s{2,10}/g, '');
                    if( i == '0'){ 
                        if(informations.length > 4){
                            informations_contact["adress"] = informations; 
                        }else{
                            informations_contact["adress"] = ""
                        }
                        
                    }
                    if( i == '1'){ 
                        if(informations.length != 0){
                            informations_contact["phone"] = informations; 
                        }else{
                             informations_contact["phone"] = ""; 
                        }
                    }
                    if( i == '2'){ 
                        if(informations.length != 0){
                            informations_contact["mail"] = informations;
                            
                        }else{
                            informations_contact["mail"] = "";
                        }
                    }
                });

                info_contact.resolve(informations_contact);
            }else{
                console.log(" vide ");
            } 
            
        }  
    });
    return info_contact;
};

function insertion (json) {
    return "insered";
}