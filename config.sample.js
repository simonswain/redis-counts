exports.redis = {
  host: '127.0.0.1',
  port: 6379
};

// get the llen of these
exports.counts = [
  'my:count:key'
];

// workers use incr on these
exports.values = [
  'my:value:key'
];
