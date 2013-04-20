var http = require('http');
var util = require('util');
var wechat = require('wechat');
var express = require('express');

var Crawler = require('./search').Crawler;
var Crawler_360 = require('./search').Crawler_360;

var c_360 = new Crawler_360();
Crawler.register(c_360);



var app = express();
app.use(express.query());



var welcome = function(res){
  res.reply('雅安地震寻人搜索整合帐号，输入姓名，将自动进行各大寻人网站的搜索，统一返回结果');
};

var search = function(str, res){
  Crawler.search(str, function(err, result){
    if(err)
      res.reply('您搜索的【'+str+'】赞时还没有信息，请稍后再查询。');
    else
      res.reply(result);
  });
};

app.use('/', wechat('xiexiaopang', function(req, res, next){
  console.log(util.inspect(req.weixin));

  var ctx = req.weixin;

  if(ctx.MsgType == 'event' && ctx.Event == 'subscribe'){
    welcome(res);
  }else if(ctx.MsgType == 'text'){
    search(ctx.Content, res);
  }else if(ctx.MsgType == 'event' && ctx.Event == 'unsubscribe'){
    console.log("unsubscribe:" + ctx.FromUserName + " " + ctx.CreateTime);
  }else{
    res.reply('目前只支持寻人信息搜索，请输入名字');
  }
}));

app.listen(9001);
