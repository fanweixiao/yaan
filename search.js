var http = require('http');
var util = require('util');
//var debug = require('debug')('Crawler');
//var debug_etao = require('debug')('360');
var cheerio = require('cheerio');

var Crawler = function(){};
Crawler.workers = [];

Crawler.search = function(str, cb){
  //debug('will search: ', str);

  var content = [];
  Crawler.workers.forEach(function(worker){
    //debug('search ['+ worker.name +'] by {' + str + '}');
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
        //debug_etao(str, "too many");
        cb("none");
      }else{
        var res = $('dl>dt').html() + ", " + $('dl dd').find('span').html() + ". " + $('dl dd').find('p').html();
        //debug_etao(str, "got");
        cb(null, '[360报平安]' + res + '\n');
      }
    }
    else{
      //debug_etao(str, "empty");
      cb("none");
    }
  });

};

/******/
var Crawler_baidu = function(){
  this.name = 'baidu';
};

Crawler_baidu.prototype.search = function(str, cb){
    var pattern = 'http://opendata.baidu.com/api.php?resource_id=6109&format=json&ie=utf-8&oe=utf-8&query=' + str + '&from_mid=1';
    var that = this;
    // debug_etao('url', pattern);

    require('request')({uri: pattern}, function(err, resp, body){
        // debug_etao('error', err);
        // debug_etao('statusCode', resp.statusCode);
        // console.log(body);

        body = JSON.parse(body);
        var data = body.data[0];
        var users = data.disp_data;
        var userStr = that.format(users);
        if(userStr.length > 1000){
            userStr = '与您查询相匹配的结果有' + users.length + '个, 因微信API限制, 无法一一列出, 请直接在电脑中打开"http://www.baidu.com/s?wd=%E9%9B%85%E5%AE%89"查询所有结果';
        };
        cb(null, userStr);
    });
};

Crawler_baidu.prototype.format = function(users){
    var userStr = '';
    for(var i = 0, l = users.length; i < l; i++){
        var user = users[i];
        if(user.found === '0'){
            user.found = '未找到';
        }else{
            user.found = '已经找到';
        };
        userStr += '[姓名]:' + user['name'] + ', ' + user['found'] + '\n';
        userStr += '[信息来源]:' + user['url'] + '\n';
        userStr += '[年龄性别]:' + user['age'] + ', ' + user['sex'] + '\n';
        userStr += '[描述]:' + user['desc'] + '\n';
        userStr += '[联系方式]:' + user['remarks'] + ', ' + user['phone'] + '\n';
        if(i < l - 1){
            userStr += '------------\n';
        };
    };
    if(users.length === 0){
        userStr = '暂时未查询到相关信息. 此工具使用方法, 直接输入精确的用户名查询，如: 林君杰';
    };
    return userStr;
};

// var c_360 = new Crawler_360('360_i_am_safe');
// Crawler.register(c_360);

// Crawler.search('光辉', function(r){ console.log(r);});
// Crawler.search('光辉啊', function(r){ console.log(r);});
// Crawler.search('光', function(r){ console.log(r);});

module.exports.Crawler = Crawler;
module.exports.Crawler_360 = Crawler_360;
module.exports.Crawler_baidu = Crawler_baidu;