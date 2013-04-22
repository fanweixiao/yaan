var http = require('http');
var util = require('util');
var Crawler = require('./search');
var Crawler_360 = require('./crawler_360');
var Crawler_baidu = require('./crawler_baidu');

var c_360 = new Crawler_360();
var c_baidu = new Crawler_baidu();
Crawler.register(c_360);
Crawler.register(c_baidu);

Crawler.search('光辉', function(err, result){
  if(err)
    console.log('您搜索的【'+str+'】暂时还没有信息，请勿着急，我们接入更多的寻人平台数据。本次搜索路径：「360报平安平台」');
  else
    console.log(result);
});
