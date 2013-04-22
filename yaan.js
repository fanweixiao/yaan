var http = require('http');
var util = require('util');
var wechat = require('wechat');
var express = require('express');

var Crawler = require('./search');
var Crawler_360 = require('./crawler_360');
var Crawler_baidu = require('./crawler_baidu');

var c_360 = new Crawler_360();
var c_baidu = new Crawler_baidu();
Crawler.register(c_360);
Crawler.register(c_baidu);

var app = express();
app.use(express.query());

var welcome = function(res){
  res.reply('我们暂时切换到<雅安地震寻人搜索整合>频道，输入姓名，将整合互联网各大报平安服务的数据。目前已接入平台：\n360报平安平台');
};

var search = function(str, res){
  Crawler.search(str, function(err, result){
    if(err)
      res.reply('您搜索的【'+str+'】暂时还没有信息，请勿着急，我们接入更多的寻人平台数据。本次搜索路径：\n「360报平安平台」\n「baidu整合搜索」');
    else
      res.reply('该公众帐号目前暂时切换至雅安地震寻人公益项目频道，您刚才的搜索结果为：\n' + result);
  });
};

app.use('/', wechat('xiexiaopang', function(req, res, next){
  var ctx = req.weixin;

  if(ctx.MsgType == 'event' && ctx.Event == 'subscribe'){
    console.log("[SUB] " + ctx.FromUserName + " " + ctx.ToUserName);
    welcome(res);
  }else if(ctx.MsgType == 'text'){
    console.log("[Q] " + ctx.FromUserName + " " + ctx.ToUserName + " " + ctx.Content);
    search(ctx.Content, res);
  }else if(ctx.MsgType == 'event' && ctx.Event == 'unsubscribe'){
    console.log("[UNSUB] " + ctx.FromUserName + " " + ctx.ToUserName);
  }else{
    res.reply('目前只支持寻人信息搜索，请输入名字进行查询');
  }
}));

app.listen(9001);
