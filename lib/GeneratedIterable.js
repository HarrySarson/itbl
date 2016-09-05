'use strict';

var definitions = require('./definitions'),
    NiceIterable = require('./NiceIterable');

var isFunction = require('lodash/isFunction');

module.exports = generateIterable;

/**
 * Wraps a generator function to produce a @link{IteratorUtil.NiceIterable `NiceIterable`}.
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
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {function} generator A function that returns iterators.
 *
 * @returns {IteratorUtil.NiceIterable} An iterable.
 *
 */
function generateIterable(generator) {
    
  var itbl = {};
  
  itbl[definitions.iteratorSymbol] = generator;
  
  return NiceIterable(itbl);     
  
}

