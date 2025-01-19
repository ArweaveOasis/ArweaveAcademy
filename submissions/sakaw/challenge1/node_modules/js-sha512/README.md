# js-sha512
[![Build Status](https://travis-ci.org/emn178/js-sha512.svg?branch=master)](https://travis-ci.org/emn178/js-sha512)
[![Coverage Status](https://coveralls.io/repos/emn178/js-sha512/badge.svg?branch=master)](https://coveralls.io/r/emn178/js-sha512?branch=master)
[![CDNJS](https://img.shields.io/cdnjs/v/js-sha512.svg)](https://cdnjs.com/libraries/js-sha512/)  
[![NPM](https://nodei.co/npm/js-sha512.png?stars&downloads)](https://nodei.co/npm/js-sha512/)  
A simple SHA-512, SHA-384, SHA-512/224, SHA-512/256 hash functions for JavaScript supports UTF-8 encoding.

## Notice
* v0.8.0+ will throw an error if try to update hash after finalize.

## Demo
[SHA512 Online](http://emn178.github.io/online-tools/sha512.html)  
[SHA384 Online](http://emn178.github.io/online-tools/sha384.html)  
[SHA512/256 Online](http://emn178.github.io/online-tools/sha512_256.html)  
[SHA512/224 Online](http://emn178.github.io/online-tools/sha512_224.html)  

## Download
[Compress](https://raw.github.com/emn178/js-sha512/master/build/sha512.min.js)  
[Uncompress](https://raw.github.com/emn178/js-sha512/master/src/sha512.js)

## Installation
You can also install js-sha512 by using Bower.

    bower install js-sha512

For node.js, you can use this command to install:

    npm install js-sha512

## Usage
You could use like this:
```JavaScript
sha512('Message to hash');
sha384('Message to hash');
sha512_256('Message to hash');
sha512_224('Message to hash');

// Support ArrayBuffer output
var arrayBuffer = sha512.arrayBuffer('Message to hash');

// Support Array output
var bytes = sha512.digest('Message to hash');
var bytes = sha512.array('Message to hash');

// update hash
var hash = sha512.update('Message to hash');
hash.update('Message2 to hash');
hash.hex();

// or to use create
var hash = sha512.create();
hash.update('Message to hash');
hash.hex();

// clone
var hash = sha512.update('Message to hash');
var hash2 = hash.clone();
hash2.hex();
hash.update('Message2 to hash');
hash.hex();

// HMAC
sha512.hmac('key', 'Message to hash');
sha384.hmac('key', 'Message to hash');

var hash = sha512.hmac.create('key');
hash.update('Message to hash');
hash.hex();

var hash2 = sha512.hmac.update('key', 'Message to hash');
hash2.update('Message2 to hash');
hash2.array();
```
If you use node.js, you should require the module first:
```JavaScript
var sha512 = require('js-sha512');
```
or 
```JavaScript
var sha512 = require('js-sha512').sha512;
var sha384 = require('js-sha512').sha384;
var sha512_256 = require('js-sha512').sha512_256;
var sha512_224 = require('js-sha512').sha512_224;
```
It supports AMD:
```JavaScript
require(['your/path/sha512.js'], function(sha512) {
// ...
});
```
## Example
```JavaScript
sha512(''); // cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
sha512('The quick brown fox jumps over the lazy dog'); // 07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6
sha512('The quick brown fox jumps over the lazy dog.'); // 91ea1245f20d46ae9a037a989f54f1f790f0a47607eeb8a14d12890cea77a1bbc6c7ed9cf205e67b7f2b8fd4c7dfd3a7a8617e45f3c463d481c7e586c39ac1ed
sha384(''); // 38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b
sha384('The quick brown fox jumps over the lazy dog'); // ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1
sha384('The quick brown fox jumps over the lazy dog.'); // ed892481d8272ca6df370bf706e4d7bc1b5739fa2177aae6c50e946678718fc67a7af2819a021c2fc34e91bdb63409d7
sha512_256(''); // c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a
sha512_256('The quick brown fox jumps over the lazy dog'); // dd9d67b371519c339ed8dbd25af90e976a1eeefd4ad3d889005e532fc5bef04d
sha512_256('The quick brown fox jumps over the lazy dog.'); // 1546741840f8a492b959d9b8b2344b9b0eb51b004bba35c0aebaac86d45264c3
sha512_224(''); // 6ed0dd02806fa89e25de060c19d3ac86cabb87d6a0ddd05c333b84f4
sha512_224('The quick brown fox jumps over the lazy dog'); // 944cd2847fb54558d4775db0485a50003111c8e5daa63fe722c6aa37
sha512_224('The quick brown fox jumps over the lazy dog.'); // 6d6a9279495ec4061769752e7ff9c68b6b0b3c5a281b7917ce0572de

// It also supports UTF-8 encoding
sha512('中文'); // 8b88efc2ebbcbdad5ac2d65af05bec57bda25e71fd5fb25bbd892057a2755fbd05d8d8491cb2946febd5b0f124ffdfbaecf7e34946353c4f1b5ab29545895468
sha384('中文'); // 93422ceb8291a69b22f02dc1114c39a287493ad525dcebc77e4019a44eaee2633a85d0f29cd298ee6799048c33a4be0c
sha512_256('中文'); // b6dab29c16ec35ab34a5d92ff135b58de96741dda78b1009a2181cf8b45d2f72
sha512_224('中文'); // 0f46a0ae7f226517dd66ece0ce1efa29ffb7ced05ac4566fdcaed188

// Different output
sha512(''); // cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
sha512.hex(''); // cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
sha512.array(''); // [207, 131, 225, 53, 126, 239, 184, 189, 241, 84, 40, 80, 214, 109, 128, 7, 214, 32, 228, 5, 11, 87, 21, 220, 131, 244, 169, 33, 211, 108, 233, 206, 71, 208, 209, 60, 93, 133, 242, 176, 255, 131, 24, 210, 135, 126, 236, 47, 99, 185, 49, 189, 71, 65, 122, 129, 165, 56, 50, 122, 249, 39, 218, 62]
sha512.digest(''); // [207, 131, 225, 53, 126, 239, 184, 189, 241, 84, 40, 80, 214, 109, 128, 7, 214, 32, 228, 5, 11, 87, 21, 220, 131, 244, 169, 33, 211, 108, 233, 206, 71, 208, 209, 60, 93, 133, 242, 176, 255, 131, 24, 210, 135, 126, 236, 47, 99, 185, 49, 189, 71, 65, 122, 129, 165, 56, 50, 122, 249, 39, 218, 62]
sha512.arrayBuffer(''); // ArrayBuffer
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/js-sha512  
Author: Chen, Yi-Cyuan (emn178@gmail.com)
