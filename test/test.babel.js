;(function () {
  'use strict';

  /** Used as a reference to the global object. */
  const root = (typeof global == 'object' && global) || this;

  /** Method and object shortcuts. */
  const
    phantom = root.phantom;
  const process = root.process;
  const amd = root.define && define.amd;
  const argv = process && process.argv;
  const defineProperty = Object.defineProperty;
  const document = !phantom && root.document;
  const body = root.document && root.document.body;
  const create = Object.create;
  const fnToString = Function.prototype.toString;
  const freeze = Object.freeze;
  const getSymbols = Object.getOwnPropertySymbols;
  const identity = value => value;
  const noop = function () {
  };
  const objToString = Object.prototype.toString;
  const params = phantom
    ? phantom.args || require('system').arg
    : argv;
  const push = Array.prototype.push;
  const realm = {};
  const slice = Array.prototype.slice;


  /** Load QUnit and extras (TODO: not portable as using fudged version of qunit-extras). */
  var QUnit = root.QUnit || require('../../qunit-extras');

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
    /* TODO add this in when stableItbl has noConflict method */ // stableItbl = stableItbl.noConflict();
  }

  /** Sample iterable values */
  const iterables = [
    [1, 2, 3],
    new Set([1, 2, 3]),
    ...(function(){
      const map = new Map([[1, 1], [2, 2], [3, 3]]);

      return ['keys', 'values'].map(funcName => ({
        [Symbol.iterator]: map[funcName].bind(map),
      }));
    })(),
    Int8Array.from([1, 2, 3]),
    '123',
    {
      * [Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    },
  ];


  /** Sample iterator values */
  const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
  
  /** Sample non-iteratable, not iterator values */
  const normalValues = [
    1,
    NaN,
    {},
    new Date(),
    Symbol('symbol'),
  ];

  /** The file path of the lodash file to test. */
  var filePath = (function () {
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
      } catch (e) {
      }

      try {
        result = require.resolve(result);
      } catch (e) {
      }
    }
    return result;
  }());


  /*--------------------------------------------------------------------------*/


  QUnit.module('isType checks');

  QUnit.test('isIterable should recognise built in iterables and generator objects', assert => {
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

    const values = [1, function () {
    }, {h: 6}];

    const expected = values.map(iterable => false);
    const actualIterable = values.map(testItbl.isIterable);
    const actualIterator = values.map(testItbl.isIterator);

    assert.deepEqual(actualIterable, expected);
    assert.deepEqual(actualIterator, expected);
  });

  /*--------------------------------------------------------------------------*/

  QUnit.module('internal wrapper checks');

  QUnit.test('wrapIterable produces an iterable instance of itbl._Wrapper', assert => {

    assert.expect(2);

    const expected = iterables.map(iterable => true);
    const wrapped = iterables.map(testItbl._wrapIterable);
    const isIterables = wrapped.map(stableItbl.isIterable);
    const instancesOf = wrapped.map(wrpd => wrpd instanceof testItbl._Wrapper);

    assert.deepEqual(isIterables, expected, 'isIterable');
    assert.deepEqual(instancesOf, expected, 'intanceof_Wrapper');

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
    const instancesOf = wrapped.map(wrpd => wrpd instanceof testItbl._Wrapper);

    assert.deepEqual(isIterables, expected, 'isIterable');
    assert.deepEqual(isIterators, expected, 'isIterator');
    assert.deepEqual(instancesOf, expected, 'intanceof _Wrapper');
  });

  QUnit.test('wrapIterable overwrites properties of `iterator` with those supplied in `methods`', assert => {

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
    let overwritten = testItbl._wrapIterator(testIterator, methods);

    assert.deepEqual(
      methodNames.map(mn => wrapped[mn]()),
      methodNames.map((mn, i) => 1 + i),
      'methods without overwrite',
    );
    assert.deepEqual(
      methodNames.map(mn => overwritten[mn]()),
      methodNames.map((mn, i) => 11 + i),
      'overwriten methods',
    );

  });


  QUnit.test('generate produces an iterable instance of itbl._Wrapper', assert => {

    assert.expect(3);

    const sym = Symbol();

    const gen = function*() {
      yield sym
    };

    const anIterable = testItbl._generateIterable(gen);


    assert.ok(stableItbl.isIterable(anIterable), 'isIterable');
    assert.strictEqual(anIterable[Symbol.iterator]().next().value, sym, '[Symbol.iterator] method is the one provided to generateIterable');
    assert.ok(anIterable instanceof testItbl._Wrapper, 'instanceof _Wrapper');
  });


  /*--------------------------------------------------------------------------*/

  QUnit.module('iteration methods');

  _.forEach([
    'filter',
    'map'
  ], methodName => {

    const
      array = [1, 2, 3],
      func = testItbl[methodName];

    QUnit.test('`itbl.' + methodName + '` should provide correct iteratee argument', assert => {
      assert.expect(1);

      let args = [];

      for( let i of  func(array, function (...a) {
        args.push(a);
      })) {}

      assert.deepEqual(args, [[1], [2], [3]]);

    });

    QUnit.test('`itbl.' + methodName + '` should return an iterable instance of itbl._Wrapper', function (assert) {
      assert.expect(2);

      const testItems = iterables.concat(iterators);
      const expected = testItems.map(item => true);
      const isIterable = testItems.map(item => stableItbl.isIterable(func(item, identity)));
      const isInstanceof = testItems.map(item => func(item, identity) instanceof testItbl._Wrapper);

      assert.deepEqual(isIterable, expected, 'isIterable');
      assert.deepEqual(isInstanceof, expected, 'instanceof _Wrapper');
    });

    QUnit.test('`itbl.' + methodName + '` should return an iterator when `iterable` is also an iterator', function (assert) {
      assert.expect(1);

      const expected = iterators.map(iterator => true);
      const isIterator = iterators.map(iterator => stableItbl.isIterator(func(iterator, identity)));

      assert.deepEqual(isIterator, expected, 'isIterator');
    });

    QUnit.test('`itbl.' + methodName + '` callback should default to identity', function (assert) {
      assert.expect(1);

      const testItems = iterables;
      const expected  = testItems.map(item => [...func(item, identity)]);
      const actual    = testItems.map(item => [...func(item)]);

      assert.deepEqual(actual, expected);
    });

    QUnit.test('`itbl.' + methodName + '` should throw if `iterable` is not iterable', function (assert) {
      assert.expect(2);

      const noIteratorMethod = {};
      const iteratorMethodInvalid = {
        [Symbol.iterator]() {
          return true;
        }
      };

      assert.throws(_.partial(func, noIteratorMethod), 'no [Symbol.iterator] method');
      assert.throws(function() { return [...func(iteratorMethodInvalid)] },
        'throws on iteration, [Symbol.iterator] method does not return an iterator');
    });

  });

  QUnit.test('`itbl.map` should map', function (assert) {
    assert.expect(1);

    assert.deepEqual(iterables.map(iterable => [...testItbl.map(iterable, x => x*x)]), iterables.map(iterable => [...stableItbl.map(iterable, x => x*x)]));
  });

  QUnit.test('`itbl.filter` should filter', function (assert) {
    assert.expect(1);

    assert.deepEqual(iterables.map(iterable => [...testItbl.filter(iterable, x => x%2 === 1)]), iterables.map(iterable => [...stableItbl.filter(iterable, x => x%2 === 1)]));
  });



  /*--------------------------------------------------------------------------*/

  QUnit.module('itbl wrapper function');

  const wrappedItems  = iterables.concat(iterators, normalValues).map(testItbl);

  QUnit.test('`itbl(anyValue)` returns an iterable instance of itbl._Wrapper', assert => {
    assert.expect(2);

    const expected      = wrappedItems.map(item => true);
    const isInstanceof  = wrappedItems.map(item => item instanceof testItbl._Wrapper);
    const isIterable    = wrappedItems.map(testItbl.isIterable);

    assert.deepEqual(isInstanceof, expected, 'instanceof');
    assert.deepEqual(isIterable, expected, 'isIterable');
  });

  QUnit.test('`itbl(iterator)` returns an iterator', assert => {
    assert.expect(1);

    const expected    = iterators.map(item => true);
    const isIterator  = iterators.map(testItbl).map(testItbl.isIterator);

    assert.deepEqual(isIterator, expected, 'isIterator');
  });

  QUnit.test('`itbl(itbl())` returns itbl instance', assert => {
    assert.expect(1);


    assert.deepEqual(wrappedItems.map(testItbl), wrappedItems);
  });

  QUnit.test('`itbl(notIterableOrIterator)` returns an iterable containing `notIterableOrIterator`', assert => {
    assert.expect(1);

    assert.deepEqual(
      normalValues.map(value => [...testItbl(value)]),
      normalValues.map(value => [value]),
      'non iterable values',
    );
  });

  QUnit.test('`itbl(function() { return notIterableOrIterator })` returns iterable containing `notIterableOrIterator`', assert => {
    assert.expect(1);

    assert.deepEqual(
      normalValues.map(value => [...testItbl(function () {
        return value
      })]),
      normalValues.map(value => [value]),
      'non iterable values',
    );
  });

  QUnit.test('`itbl(function() { ... })` function should be called when (and only when) iterator is produced', assert => {
    assert.expect(3);


    let flag = 0;

    const sideEffect = testItbl(function () {
      flag++;
      return [1, 2, 3, 5];
    });


    assert.strictEqual(flag, 0, 'function not called before wrapper is iterated over');
    [...sideEffect];
    assert.strictEqual(flag, 1, 'function is called once when wrapper is iterated');
    [...sideEffect];
    assert.strictEqual(flag, 2, 'function is called again for a second iteration iteration');
  });

  QUnit.test('`itbl(function() { return iterable })` should return `iterable` wrapped', assert => {
    assert.expect(3);

    const symb = Symbol('aSymbol');
    const anIterable = testItbl(function () {
      return {
        * [Symbol.iterator]() {
          yield symb;
        }
      }
    });

    assert.deepEqual([symb], [...anIterable], 'iterables');
    assert.ok(testItbl.isIterable(anIterable), 'isIterable');
    assert.notOk(testItbl.isIterator(anIterable), 'not isIterator');
  });

  QUnit.test('`itbl(function() { return iterator })` should return an iterable that produces `iterator`\'s', assert => {
    assert.expect(4);

    const symb = Symbol('aSymbol');
    const anIterable = testItbl(function () {
      return [symb][Symbol.iterator]()
    });

    assert.deepEqual([symb], [...anIterable], 'iterables');
    assert.deepEqual([symb], [...anIterable], 'iterables - iterator re-created for second iteration');
    assert.ok(testItbl.isIterable(anIterable), 'isIterable');
    assert.notOk(testItbl.isIterator(anIterable), 'not isIterator');
  });


  /*--------------------------------------------------------------------------*/


  QUnit.config.asyncRetries = 10;
  QUnit.config.hidepassed = true;

  if (!root.document) {
    QUnit.config.noglobals = true;
    QUnit.load();
    QUnit.start();
  }
}).call(this, this);


