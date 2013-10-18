/*
 * redis-counts
 * https://github.com/simonswain/redis-counts
 *
 * Copyright (c) 2013 Simon Swain
 * Licensed under the MIT license.
 */

var redis = require('redis');
var async = require('async');
var _ = require('underscore');

var config = require('./config.js');
var client = redis.createClient(config.redis);

function cls(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
}

// get the llen of these
var count_keys = config.counts;

// workers use incr on these
var value_keys = config.values;

var counts = {};
var values = {};

_.each(count_keys, function(key){
  counts[key] = {
    value: 0,
    prev: 0,
    delta: 0
  };
});

_.each(value_keys, function(key){
  values[key] = {
    value: 0,
    prev: 0,
    delta: 0
  };
});

var fetch_count = function(key, done){
  client.llen(key, function(err, value){
    value = Number(value);
    if(!value){
      value = 0;
    }
    counts[key].prev = counts[key].value;
    counts[key].delta = value - counts[key].prev;
    counts[key].value = value;
    done();
  });
}

var fetch_counts = function(done){
  async.each(count_keys, fetch_count, done);
}

var fetch_value = function(key, done){
  client.get(key, function(err, value){
    value = Number(value);
    if(!value){
      value = 0;
    }
    values[key].prev = values[key].value;
    values[key].delta = value - values[key].prev;
    values[key].value = value;
    done();
  });
}

var fetch_values = function(done){
  async.each(value_keys, fetch_value, done);
}

var pad = '                            ';

var print = function(k, v, d){
  console.log(k + pad.substr(0, 30-k.length) + ' ' + v + pad.substr(0, 8-String(v).length) + ' ' + d);
};

var render = function(){
  cls();
  console.log(new Date());
  console.log();

  _.each(count_keys, function(key){
    var sign = (counts[key].delta < 0) ? '' : '+';
    print(key, counts[key].value, sign + counts[key].delta + '/s');
  });

  console.log();

  _.each(value_keys, function(key){
    var sign = (values[key].delta < 0) ? '' : '+';
    print(key, values[key].value, sign + values[key].delta + '/s');
  });

}

var run = function(){
  async.parallel(
    [fetch_counts, fetch_values],
    function(){
      render();
      setTimeout(run, 1000);
    });
};

run();
