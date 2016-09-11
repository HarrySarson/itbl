;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  } else {
    root.itbl = factory(root._);
  }
}(this, function(_) {
'use strict'; 

var isSymbol = _.isSymbol
var isFunction = _.isFunction

var supported = typeof Symbol !== 'undefined' && Symbol != null && isSymbol(Symbol.iterator),
    itSymb = supported ? Symbol.iterator : null;

function definitions(addTo) {

  /**
   * Read only boolean value indicating whether es6 iterators are supported.
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @property {boolean}
   * @name nativeIterators
   *
   * <table>
   *   <tr>
   *   <td colspan="2">Property attributes of <code>nativeIterators</code></td>
   *   </tr>
   *   <tr> <td>Writable</td> <td>no</td> </tr> 
   *   <tr> <td>Enumerable</td> <td>yes</td> </tr> 
   *   <tr> <td>Configurable</td> <td>no</td> </tr> 
   * </table>
   */
  Object.defineProperty(addTo, 'nativeIterators', {
    value: supported,
    enumerable: true,
    configurable: false,
    writable: false
  });

  /**
   * Symbol or string used by libary to access iterator method, 
   * defaults to `es6`'s `Symbol.iterator`.
   * Can be overwritten by a symbol or by any non-null value convertable 
   * to a string to allow polyfilled support for iterators.
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @property {string|Symbol}
   * @name iteratorSymbol
   *
   * <table>
   *   <tr>
   *   <td colspan="2">Property attributes of <code>iteratorSymbol</code></td>
   *   </tr>
   *   <tr> <td>Writable</td> <td>yes</td> </tr> 
   *   <tr> <td>Enumerable</td> <td>yes</td> </tr> 
   *   <tr> <td>Configurable</td> <td>no</td> </tr> 
   * </table>
   */
  Object.defineProperty(addTo, 'iteratorSymbol', {
    get: function() { return itSymb; },
    set: function(v) { 
      itSymb = isSymbol(v) 
          ? v 
          : v == null || !isFunction(v.toString) 
            ? null 
            : v + ''; 
    }, 
    enumerable: true,
    configurable: false
  });
}

// add definitions to module but also export function that
// will add definitions to other objects.

definitions(definitions);

/** 
 * Base class with prototype containing chained itbl methods.
 * This class is returned by `itbl()` and `itbl.wrap()`.
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @constructor
 *
 */
var Wrapper = function() {};

var bind = _.bind

// the es6 way to implement this class probabaly uses Proxy.

/**
 * Wraps an iterator, adding chainable itbl methods.
 * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to both the 
 * iterable protocol and the iterator protocol as well as defining the `return()`
 * and `throw()` methods if (and only if) `iterator` defines them.
 *
 * **Note**: There is no error checking.
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterator} iterator Iterator to wrap.
 * 
 * @return {itbl.Wrapper} Wrapped iterator.
 *
 */
function wrapIterator(iterator) {

  var wrapper = new Wrapper();

  wrapper.next = bind(iterator.next, iterator);

  wrapper[definitions.iteratorSymbol] = function() { return this; }  

  if( isFunction(iterator['return']) ) 
    wrapper['return'] = bind(iterator['return'], iterator);

  if( isFunction(iterator['throw']) )
    wrapper.throw = bind(iterator['throw'], iterator);

  return wrapper;
}

// the es6 way to implement this class probabaly uses Proxy.

/**
 * Wraps an iterable, adding chainable itbl methods.
 * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to the iterable protocol.
 *
 * **Note**: There is no error checking.
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterable} iterable Iterable to wrap.
 * 
 * @return {itbl.Wrapper} Wrapped iterable.
 *
 */
function wrapIterable(iterable) {

  var wrapper = new Wrapper();

  wrapper[definitions.iteratorSymbol] = function() {
    return wrapIterator(iterable[definitions.iteratorSymbol]());
  };

  return wrapper;

}

/**
 * Wraps a generator function to produce a @link{itbl.Wrapper wrapped iterable}.
 * 
 * The generator function can be any function that returns an iterator, this includes functions
 * declared `function* gen() {}`.
 *
 * If the function produces independant iterators each time it is called (which `function*() { ... }` does)
 * then iterating over the created iterable wil not cause it to change, so it can be used multiple times.
 *
 * **Note**: There is no error checking.
 *
 *
 * @private
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {function} generator A function that returns iterators.
 *
 * @returns {itbl.Wrapper} An iterable.
 *
 */
function generateIterable(generator) {

  var itbl = {};

  itbl[definitions.iteratorSymbol] = generator;

  return wrapIterable(itbl);     

}

/**
 * Checks if `value` is an iterable objectaccording to es6 iterator protocols.
 * In order to be iterable, an object must implement the @@iterator method,
 * meaning that the object (or one of the objects up its prototype chain) 
 * must have a property with a Symbol.iterator key which defines a function.
 * (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * 
 * function MyIterable() { }
 * MyIterable.prototype[Symbol.iterator] = function*(){
 *   while(true) yield 1;
 * }
 * 
 * let iterableInstance = new MyIterable();
 *
 * itbl.isIterable(iterableInstance);
 * // => true
 *
 * // generator function that is then called
 * itbl.isIterable(iterableInstance[Symbol.iterator]());
 * // => true (this is both an iterator and also iterable)
 *
 * itbl.isIterable([1, 2, 3]);
 * // => true
 *
 * itbl.isIterable({1: 1, 2: 2, 3: 3});
 * // => false
 */
function isIterable(value) {

  return value != null && isFunction(value[definitions.iteratorSymbol]);

};

/**
 * Checks if `value` is an iterator according to es6 iterator protocols.
 * An object is an iterator when it implements a next() method.
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterator
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * function MyIterable() { }
 * MyIterable.prototype[Symbol.iterator] = function*(){
 *   while(true) yield 1;
 * }
 * 
 * let iterableInstance = new MyIterable();
 *
 * itbl.isIterable(iterableInstance);
 * // => false (this is an iterable but NOT an iterator)
 *
 * // generator function that is then called
 * itbl.isIterable(iterableInstance[Symbol.iterator]());
 * // => true (this is both an iterator and also iterable)
 *
 * itbl.isIterator([1, 2, 3][Symbol.iterator]());
 * // => true
 *
 * for(let i of ['a'])
 *   itbl.isIterator(i)
 * // => false (i is equal to 'a')
 */
function isIterator(value) {

  return value != null && isFunction(value.next);

};

var constant = _.constant

/** 
 * Wraps an iterable, iterator, generator function (any function
 * that returns iterators), or a value to produce an objcet that conforms to the
 * iterable protocol (and iterator protocol if `value` is an iterator). 
 *
 * If a value is provided that is not an iterable or an iterator, or is a function that does
 * not return iterators, it (or its return value) is wrapped in an iterable so that `itbl(6)`
 * is equivilent to both `itbl(function() { return 6; })` and `itbl([6])`
 *
 * All itbl functions that take an iterable as their first parameter
 * and return an iterable are chainable and so can be called as methods of the
 * wrapped value.
 *
 * The chainable methods are:
 * 
 * `filter` and `map`.
 *
 * In custom builds, including a function in the build will attach that function
 * as a method to all wrapped values.
 *
 *
 * @static
 * @memberOf itbl
 * @alias itbl
 * @since 0.1.0
 * @param {*} value The value to wrap.
 *
 * @returns {itbl.Wrapper} An iterable which may also be an iterator.
 *
 */
function wrap(value) {

  if( isIterator(value) )
    return wrapIterator(value);

  // note iterators may also be iterable but they are treated as iterators
  if( isIterable(value) )
    return wrapIterable(value);

  if( isFunction(value) )
    return GeneratedIterable(function(){

      var it = value(),
          count = 0;

      if( isIterator(it) )
        return it;
      else 
        return {
          next: function(){ 
            return count++
              ? { done: true }
              : { value: it, done: false };
          }          
        }
    });

  return GeneratedIterable(function(){

    var count = 0;

    return {
      next: function(){ 
        return count++
          ? { done: true }
          : { value, done: false };
      }          
    }
  }); 
}

/**
 * Gets iterator from `iterable`. In `es6` environments using default value of `itbl.iteratorSymbol` when
 * `iterable` is a valid iterator, this is equivilent to calling `iterable[Symbol.iterator]`. This function includes
 * support for different values of `itbl.iteratorSymbol` and helpful error messages.
 *
 * If `iterable == null` then an 'done' iterator is returned.
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} [iterable = []] Iterable to get iterator to.
 *
 * @returns {itbl.Wrapper} An iterator
 * @throws {Error} Throws an error if iterators are not supported or the argument is not iterable.
 *
 * @example
 *
 * let it = itbl.getIterator([1,2,3]);
 *
 * it.next() // { value: 1, done: false }
 * it.next() // { value: 2, done: false }
 * it.next() // { value: 3, done: false }
 * it.next() // { value: undefined, done: true }
 *
 */
function getIterator(iterable) {

  if( definitions.iteratorSymbol == null )
    throw new Error('itbl: Iterators are natively not supported, set itbl.iteratorSymbol to use iterators');  

  if( iterable === undefined )
    return { 
      next: function() { return { done: true }; } 
    };

  if( !isIterable(iterable) )
    throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method not defined).');

  var iterator = iterable[definitions.iteratorSymbol]();

  if( !isIterator(iterator) )
    throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method does not return an iterator.');

  return wrapIterator(iterator);    

}

var mapValues = _.mapValues
var reduce = _.reduce

/**
 * Combines the iterables in `collection` into a single iterable containing collections
 * of values from each iterable in `collection`.
 *
 * `collection` can either be an iterable containing iterable values that will be combined
 * into an iterable containing iterables containing all the values of the iterable from `collection`
 * or an object whose own, enumerable properties are iterables to be combined into an
 * iterable containing objects whose own, enumberable properties are the same as `collection`'s
 * and the values of those properties will be the values of the iterable from `collection`.
 *
 * The value of `finish` determines when the iteration ends.
 *
 * * If `finish === 'early' or 'e'` (default) then the iteration ends as soon as the first iterator from
 * `collection` ends.
 * 
 * * If `finish === 'late' or 'l'` then the iteration continues untill all iterators from `collection` are done.
 * Values corresponding to iterators that have ended are `undefined`.
 *
 * * If `finish === 'together' or 't'` then all iterators from `collection` must finish on the same iteration or
 * else an `Error` is thrown.
 *
 * **Note**: The return value of the iterator is a collection of the of the return values the iterators
 * from `collection`. Return values corresponding to iterators that have not yet ended are `undefined`
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterable|Object} collection Collection of iterators
 * @param {string} [finish = 'early'] Flag determining when iteration will finish.
 *
 * @returns {itbl.Wrapper} Iterable containing collection of values
 * @example
 *
 * for(let coor of itbl.combine({
 *   x: [1,2,3,4,5],
 *   y: [1,4,9,16,25]
 * })){
 *   context.lineTo(coor.x, coor.y);
 * }
 * 
 * let mySet = new Set();
 * mySet.add(1);
 * mySet.add(Math);
 *
 * let iterable = itbl.combine([['a','b','c'], ['alpha','beta', 'gamma'], mySet]);
 * [...iterable];
 * // [['a', 'alpha', 1], ['b', 'beta', Math]]
 */
function combine(collection, finish) {

  finish = (finish === 'e' || finish === 'early')
    ? 'early' 
    : (finish === 'l' || finish === 'late')
      ? 'late'
      : (finish === 't' || finish === 'together')
        ? 'together'
        : null;

  if( finish == null )
    throw new Error('itbl: parameter finish to combine is not reconised');

  var create = isIterable(collection)
        ? Array
        : Object,

      finishLate = (finish === 'late');

  return GeneratedIterable(function() {

    // TODO slightly unhelpful error message generated
    // also mapValues on array converts to an object, don't that that
    // makes any difference

    var its = mapValues(collection, getIterator),
        done = false;

    var returnValues = create(),
        anyValues,
        values,

        cb = finishLate
          ? function lateCb(every, it, key) {

            if( returnValues.hasOwnProperty(key) )
              return every;

            var step = it.next();

            if( step.done )
            {
              returnValues[key] = step.value;
              return every;
            }
            else
            {
              values[key] = step.value;
              return false;
            }
          }
          : function earlyCb(some, it, key) {

            var step = it.next();

            if( step.done )
            {
              returnValues[key] = step.value;
              return true;
            }
            else
            {
              anyValues = true;
              values[key] = step.value;
              return some;
            }
          };

    return {
      next: function() {
        if( done )
          return { done: true }

        values = create();
        anyValues = false;

        if( reduce(its, cb, !!finishLate) ) 
        {
          if( finish === 'together' && anyValues )
            throw new Error("itbl: iterables combined with finish === 'together' have not finished together");

          done = true;

          return {
            value: returnValues,
            done: true
          }
        }
        else
          return {
            value: values,
            done: false
          }
      }
    };
  });

};

var parseIteratee = _.iteratee

/**
 * Creates a new iterable containing values which the `predicate` returns truthy for. 
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to filter the values of.
 * @param {Function} [predicate = _.identity] Function to run each value though.
 *
 * @returns {itbl.Wrapper} New filtered iterable
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * [...itbl.filter([0,1,2,3,4,5], val => val%2 === 0)]
 * // [0,2,4]
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * [...itbl.filter(mySet, value => _.isFinite)]
 * // [1]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * [...itbl.filter(users, function(o) { return !o.active; })];
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * [...itbl.filter(users, { 'age': 36, 'active': true })];
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * [...itbl.filter(users, ['active', false])];
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * [...itbl.filter(users, 'active')];
 * // => objects for ['barney']
 *
 */
function filter(iterable, predicate) {

  predicate = parseIteratee(predicate);

  return GeneratedIterable(function() {

    var it = getIterator(iterable);

    return {

      next: function FilteredIterator() {

        var step;

        while( !(step = it.next()).done && !predicate(step.value) );

        if( step.done )
          return { done: true };
        else
          return { value: step.value, done: false };
      }      
    };

  });
}

Wrapper.prototype.filter = function(predicate) {
  return filter(this, predicate);
};

/**
 * Gets and iterator from `iterable` and increments an iterator until 
 * `iterator.next().done === true`. The final value of the iterator is then returned. 
 * If `iterable` has no values, undefined is returned. 
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to get final value of.
 *
 * @returns {*} Final value of the iterator.
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * itbl.finalValue([1,2,3,4,5,6,7]);
 * // => `7` (note much quicker to use _.last)
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * itbl.finalValue(mySet);
 *  // => `NaN`
 */
function finalValue(iterable) {

  var it = getIterator(iterable);

  var value, step;

  while( !(step = it.next()).done )
    value = step.value;

  return value;

}

// TODO make sure iterator is closed if mapping is interupted

/**
 * Creates a new iterable whose iterators will have values coresponding to the value
 * of the Iterator of the original iterable run through `iteratee`.
 * The iteratee is invoked with only one argument (value). 
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to map values of.
 * @param {Function} [iteratee = _.identity] Function to run each value though.
 *
 * @returns {itbl.Wrapper} A new mapped iterable
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * for(let coor of itbl.map([0,1,2,3,4,5], x => ({ x, y: Math.exp(x)))) {
 *   context.lineTo(coor.x, coor.y);
 * }
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * [...itbl.map(mySet, value => value + 1)]
 * // [2, 'a1', NaN]
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * [...itbl.map(users, 'user');
 * // => ['barney', 'fred']
 *
 */
function map(iterable, iteratee) {

  iteratee = parseIteratee(iteratee);

  return GeneratedIterable(function() {

    var it = getIterator(iterable);

    return {

      next: function MappedIterator() {

        var step = it.next();

        if( step.done )
          return { done: true };
        else
          return { value: iteratee(step.value), done: false };
      }      
    };

  });
}

Wrapper.prototype.map = function(iteratee) {
  return map(this, iteratee);
};

/**
 * Iterates over `iterable` and creates an array containing the values contained
 * within iterable. Behavour is designed to replicate the `es6` syntax: `[...iterable]`.
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Values to put into array.
 *
 * @returns {array} Array containing values of `iterable`.
 * @throws {Error} Throws an error if iterators are not supported or the argument is not iterable.
 *
 * @example
 *
 * function *gen() {
 *   yield 1;
 *   yield 2; 
 *   yield 3; 
 * }
 *
 * itbl.toArray(gen());
 * // [1,2,3]
 *
 * let mySet = new Set();
 * mySet.add(1);
 * mySet.add(Math);
 *
 * itbl.toArray(mySet);
 * [1, Math];
 */
function toArray(iterable) {

  let it = getIterator(iterable),
      arr = [],
      step;

  while( !(step = it.next()).done )
    arr.push(step.value);

  return arr;
}

var itbl = function itbl(value) {
  return wrap(value);
};

definitions(itbl);

itbl.combine = combine;
itbl.filter = filter;
itbl.finalValue = finalValue;
itbl.isIterable = isIterable;
itbl.isIterator = isIterator;
itbl.map = map;
itbl.toArray = toArray;
itbl.itbl = itbl;
itbl.wrap = wrap;

return itbl;
}));
