var http = require('http');
var util = require('util');
var debug = require('debug')('Crawler');

var Crawler = function(){};
Crawler.workers = [];

Crawler.search = function(str, cb){
  debug('will search: ', str);

  var content = [], _t=1;
  Crawler.workers.forEach(function(worker){
    debug('search ['+ worker.name +'] by {' + str + '}');
    worker.search(str, function(err, _m){
      debug('ERR', err);
      if(!err){
        debug('_m', _m);
        Crawler.agg(_t++, Crawler.workers.length, _m, content, cb);
      } else {
        debug('ERR', err);
        Crawler.agg(_t++, Crawler.workers.length, null, content, cb);
      }
    });
  });
}

Crawler.register = function(_c){
  Crawler.workers.push(_c);
};

Crawler.agg = function(_t, _l, _m, _c, cb){
  if(_m)
    _c.push(_m);
  if(_t == _l){
    var str = _c.join('');
    debug('str', str);
    if(str == ''){
      cb('empty');
    }else{
      cb(null, str);
    }
  }
}

module.exports = Crawler;
