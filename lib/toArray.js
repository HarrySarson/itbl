'use strict';

var accumulate = require('./accumulate'),
    finalValue = require('./finalValue');

module.exports = toArray;



/**
 * Iterates over `iterable` and creates an array containing the values contained
 * within iterable. Behavour is designed to replicate the `es6` syntax: `[...iterable]`.
 *
 * @static
 * @memberOf IteratorUtil
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
 * IteratorUtil.toArray(gen());
 * // [1,2,3]
 *
 * let mySet = new Set();
 * mySet.add(1);
 * mySet.add(Math);
 *
 * IteratorUtil.toArray(mySet);
 * [1, Math];
 */
function toArray(iterable) {
  
  return finalValue(
    accumulate(
      iterable, 
      (arr, val) => {
        arr.push(val);
        return arr;
      }, 
      []
    )
  ); 
}
