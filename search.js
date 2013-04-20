var http = require('http');
var util = require('util');
var debug = require('debug')('Crawler');
var debug_etao = require('debug')('360');
var cheerio = require('cheerio');

var Crawler = function(){};
Crawler.workers = [];

Crawler.search = function(str, cb){
  debug('will search: ', str);

  var content = [];
  Crawler.workers.forEach(function(worker){
    debug('search ['+ worker.name +'] by {' + str + '}');
    worker.search(str, cb);
  });
};

Crawler.register = function(_c){
  Crawler.workers.push(_c);
};

/******/
var Crawler_360 = function(){
  this.name = '360';
};

Crawler_360.prototype.search = function(str, cb){
  var pattern = "http://www.so.com/yaan?a=search&id=3&kw=" + encodeURIComponent(str);
  // debug_etao('url', pattern);

  require('request')({uri: pattern}, function(err, resp, body){
    // debug_etao('error', err);
    // debug_etao('statusCode', resp.statusCode);
    // console.log(body);

    var $ = cheerio.load(body);
    var dl = $('dl');
    if(dl.length > 0){
      if(dl.length > 3){
        debug_etao(str, "too many");
        cb("none");
      }else{
        var res = $('dl>dt').html() + ", " + $('dl dd').find('span').html() + ". " + $('dl dd').find('p').html();
        debug_etao(str, "got");
        cb(null, '[360报平安]' + res);
      }
    }
    else{
      debug_etao(str, "empty");
      cb("none");
    }
  });

};

// var c_360 = new Crawler_360('360_i_am_safe');
// Crawler.register(c_360);

// Crawler.search('光辉', function(r){ console.log(r);});
// Crawler.search('光辉啊', function(r){ console.log(r);});
// Crawler.search('光', function(r){ console.log(r);});

module.exports.Crawler = Crawler;
module.exports.Crawler_360 = Crawler_360;