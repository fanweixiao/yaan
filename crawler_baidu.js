var http = require('http');
var util = require('util');
var debug = require('debug')('crawler_baidu');

var Crawler_baidu = function(){
  this.name = 'baidu';
};

Crawler_baidu.prototype.search = function(str, cb){
  var pattern = 'http://opendata.baidu.com/api.php?resource_id=6109&format=json&ie=utf-8&oe=utf-8&query=' + encodeURIComponent(str) + '&from_mid=1';
  var that = this;
  debug('url', pattern);

  require('request')({uri: pattern}, function(err, resp, body){
    if(err){
      debug('error', err);
      cb(err);
      return;
    }

    debug('statusCode', resp.statusCode);
    // console.log(body);

    try{
      body = JSON.parse(body);
      debug(util.inspect(body));
      var data = body.data[0];
      var users = data.disp_data;
      var userStr = that.format(users);
      if(userStr.length > 1000){
        userStr = '与您查询相匹配的结果有' + users.length + '个, 因微信API限制, 无法一一列出, 请直接在电脑中打开"http://www.baidu.com/s?wd='+ encodeURIComponent(str) +'"查询所有结果\n';
      };
      cb(null, userStr);
    }catch(err){
      cb(err);
    }
  });
};

Crawler_baidu.prototype.format = function(users){
  var userStr = [];
  for(var i = 0, l = users.length; i < l; i++){
    var user = users[i];
    debug('user', util.inspect(user));
    user.found = '已找到!!!';
    if(user.found === '0'){
      user.found = '未找到';
    }
    userStr.push('['+user.found + '] ');
    userStr.push(user['name']);
    userStr.push(' [信息来源]' + user['source']);
    userStr.push(' [年龄]' + user['age'] + ' [性别]' + user['sex']);
    userStr.push(' [联系方式]' + user['remarks'] + ', ' + user['phone']);
    userStr.push('\n');
  };
  if(users.length === 0){
    userStr.push('[baidu整合搜索无结果,或尝试精确用户名]\n');
  };
  userStr.push('{本次搜索路径：百度}');
  return userStr.join('');
};

//var c_baidu = new Crawler_baidu();
//c_baidu.search('光i辉', function(r, n){ 
//  debug('ERR',r);
//  console.log(n);
//});

module.exports = Crawler_baidu;
