# `mute`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

Politely tells one or more streams to shut the heck up for a moment by temporarily reassigning their write methods. Useful when testing noisey modules which lack verbosity options. Mutes `stdout` and `stderr` by default.

## Install

```
$ npm install --save mute
```

## Usage

```js
var mute = require('mute');

// Mute stdout and stderr
var unmute = mute();

console.log('foo');   // doesn't print 'foo'
console.error('bar'); // doesn't print 'bar'

unmute();

console.log('foo');   // prints 'foo'
console.error('bar'); // prints 'bar'

// Mute just stderr
var unmuteErr = mute(process.stderr);

console.log('foo');   // prints 'foo'
console.error('bar'); // doesn't print 'bar'

unmuteErr();

console.log('foo');   // prints 'foo'
console.error('bar'); // prints 'bar'
```

## API

### `mute(...stream): Function()`

Accepts one or more streams or arrays of streams, mutes them all, and returns a function to unmute them.

## Test

```
$ npm test
```

## Contribute

[![Tasks][waffle-img]][waffle-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/mute/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/mute
[downloads-img]: http://img.shields.io/npm/dm/mute.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/mute.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/mute
[travis-img]:    http://img.shields.io/travis/shannonmoeller/mute.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/mute
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/mute.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/mute
