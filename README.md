# Redis Counts

A simple live view of Redis counts and list lengths.

## Installing

```bash
git clone git@github.com:simonswain/redis-counts.git
cd redis-counts
npm install
cp config.sample.js config.js
```

Edit `config.js` to point to your Redis instance, and identify the
keys you want to watch:

```javascript
// get the llen of these
exports.counts = [
  'my:count:key'
];

// incr these
exports.values = [
  'my:value:key'
];
```

Count keys assume they key is a Redis list and will perform an `LLEN`
on the key to get a count of it's members.

Value keys will perform a `GET`, assuming the key is numeric and
`INCR` is being used on the key.

## Running

```bash
~/redis-counts$ node counts
```

You will see a screen listing all your keys, their current
length/value and an approximate rate of change.

```
my:redis:key         1952     +52/s
```

`redis-counts` was developed for debugging [Straw](http://strawjs.com) topologies.

## Release History

* 18/10/2013 0.0.1 Initial release
