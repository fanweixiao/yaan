var http = require('http');
var util = require('util');
var debug_360 = require('debug')('360');
var cheerio = require('cheerio');

var Crawler_360 = function(){
  this.name = '360';
};

Crawler_360.prototype.search = function(str, cb){
  var pattern = "http://www.so.com/yaan?a=search&id=3&kw=" + encodeURIComponent(str);
  debug_360('url', pattern);

  require('request')({uri: pattern}, function(err, resp, body){
    if(err){
      debug_360('error', err);
      cb(err);
      return;
    }

    debug_360('statusCode', resp.statusCode);
    //console.log(body);

    var $ = cheerio.load(body);
    var dl = $('dl');
    if(dl.length > 0){
      if(dl.length > 3){
        debug_360(str, "too many");
        cb(null, "无准确搜索结果{本次搜索路径：360报平安}\n");
      }else{
        var res = $('dl>dt').html() + ", " + $('dl dd').find('span').html() + ". " + $('dl dd').find('p').html();
        debug_360(str, "got");
        cb(null, '[已找到!!!]' + res + '\n' + '{本次搜索路径：360报平安}\n');
      }
    }
    else{
      debug_360(str, "empty");
      cb(null, "无准确搜索结果{本次搜索路径：360报平安}\n");
    }
  });
};

module.exports = Crawler_360;
