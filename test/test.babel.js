;(function() {
  'use strict'

  /** Used as a reference to the global object. */
  const root = (typeof global == 'object' && global) || this;

   /** Method and object shortcuts. */
  const
    phantom = root.phantom,
    process = root.process,
    amd = root.define && define.amd,
    argv = process && process.argv,
    defineProperty = Object.defineProperty,
    document = !phantom && root.document,
    body = root.document && root.document.body,
    create = Object.create,
    fnToString = Function.prototype.toString,
    freeze = Object.freeze,
    getSymbols = Object.getOwnPropertySymbols,
    identity = function(value) { return value; },
    noop = function() {},
    objToString = Object.prototype.toString,
    params = phantom
      ? phantom.args || require('system').arg
      : argv,
    push = Array.prototype.push,
    realm = {},
    slice = Array.prototype.slice;


  /** Load QUnit and extras. */
  var QUnit = root.QUnit || require('qunit-extras');

  /** Load lodash */
  const _ = root._ || require('lodash');

  /** Load version of itbl to test */
  const testItbl = root.itbl || require('../itbl');

  /** Load stable itbl. */
  var stableItbl = root.stableItbl;
  if (!stableItbl) {
    try {
      stableItbl = require('../node_modules/itbl/itbl.js');
    } catch (e) {
      console.log('Error: The stable itbl dev dependency should be at least a version behind master branch.');
      throw e;
    }
    /* TODO add this in when stableItbl has noConlict method */ // stableItbl = stableItbl.noConflict();
  }

  /** Sample iterable values */
  const iterables = [
    [1,2,3],
    new Set([1, 2, 3]),
    new Map([[1, 1], [2, 2], [3,3]]),
    Int8Array.from([1, 2, 3]),
    '123',
    function*() {
      yield 1;
      yield 2;
      yield 3;
    }(),
  ];

  /** Sample iterator values */
  const iterators = iterables.map(iterable => iterable[Symbol.iterator]());

  /** The file path of the lodash file to test. */
  var filePath = (function() {
    var min = 2,
        result = params || [];

    if (phantom) {
      min = 0;
    }
    var last = result[result.length - 1];
    result = (result.length > min && !/test(?:\.js)?$/.test(last)) ? last : '../lodash.js';

    if (!amd) {
      try {
        result = require('fs').realpathSync(result);
      } catch (e) {}

      try {
        result = require.resolve(result);
      } catch (e) {}
    }
    return result;
  }());


  /*--------------------------------------------------------------------------*/


  QUnit.module('isType checks');

  QUnit.test('isIterable should reconise built in iterables and generator objects', assert => {
    assert.expect(1);

    const expected = iterables.map(iterable => true);
    const actual = iterables.map(testItbl.isIterable);

    assert.deepEqual(actual, expected, 'harry');
  });

  QUnit.test('isIterator should reconise iterators from built in iterables and generator objects', assert => {
    assert.expect(1);

    const expected = iterables.map(iterable => true);
    const actual = iterables.map(iterable => iterable[Symbol.iterator]()).map(testItbl.isIterator);

    assert.deepEqual(actual, expected);
  });

  QUnit.test('isIterator and isIterable should detect non-iterators/non-iterables', assert => {
    assert.expect(2);

    const values = [1, function() {}, { h: 6}];

    const expected = values.map(iterable => false);
    const actualIterable = values.map(testItbl.isIterable);
    const actualIterator = values.map(testItbl.isIterator);

    assert.deepEqual(actualIterable, expected);
    assert.deepEqual(actualIterator , expected);
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('wrapper checks');

  QUnit.test('wrapIterable produces an iterable instance of itbl._Wrapper', assert => {

    assert.expect(2);

    const expected = iterables.map(iterable => true);
    const wrapped = iterables.map(testItbl._wrapIterable);
    const isIterables = wrapped.map(stableItbl.isIterable);
    const instancesOf = wrapped.map(wrpd =>  wrpd instanceof testItbl._Wrapper);

    assert.deepEqual(isIterables, expected, 'iterable');
    assert.deepEqual(instancesOf, expected, 'intanceof wrapper');

  });

  QUnit.test('wrapIterable throws Error if [Symbol.iterator] method does not return an iterator', assert => {

    assert.expect(1);

    const badIterable = {
      [Symbol.iterator]() {
        return 5;
      },
    };

    const wrapped = testItbl._wrapIterable(badIterable);

    assert.throws(wrapped[Symbol.iterator]);

  });

  QUnit.test('wrapIterable produces an iterator and iterable instance of itbl._Wrapper', assert => {

    assert.expect(3);

    const expected = iterators.map(itorator => true);
    const wrapped = iterators.map(testItbl._wrapIterator);
    const isIterables = wrapped.map(stableItbl.isIterable);
    const isIterators = wrapped.map(stableItbl.isIterator);
    const instancesOf = wrapped.map(wrpd =>  wrpd instanceof testItbl._Wrapper);

    assert.deepEqual(isIterables, expected, 'iterable');
    assert.deepEqual(isIterables, expected, 'iterator');
    assert.deepEqual(instancesOf, expected, 'intanceof wrapper');
  });

  QUnit.test('wrapIterable overwrites properties of `iterator` with those suplied in `methods`', assert => {

    assert.expect(2);

    let testIterator = {
      [Symbol.iterator]() {
        return 1;
      },
      next() {
        return 2;
      },
      return() {
        return 3;
      },
      throw() {
        return 4;
      },
    };
    
    let methods = {
      [Symbol.iterator]() {
        return 11;
      },
      next() {
        return 12;
      },
      return() {
        return 13;
      },
      throw() {
        return 14;
      },
    };
    
    let methodNames = [
      Symbol.iterator,
      'next',
      'return',
      'throw',
    ];
    
    let wrapped = testItbl._wrapIterator(testIterator);
    let overwriten = testItbl._wrapIterator(testIterator, methods);
    let expect = methodNames.map(mn => true);
    
    assert.deepEqual(
      methodNames.map(mn => wrapped[mn]()),
      methodNames.map((mn, i) => 1 + i),
      'methods without overwrite',
    );
    assert.deepEqual(
      methodNames.map(mn => overwriten[mn]()),
      methodNames.map((mn, i) => 11 + i),
      'overwriten methods',
    );
    
  });







  /*--------------------------------------------------------------------------*/

  QUnit.config.asyncRetries = 10;
  QUnit.config.hidepassed = true;

  if (!root.document) {
    QUnit.config.noglobals = true;
    QUnit.load();
    QUnit.start();
  }
}.call(this, this));


