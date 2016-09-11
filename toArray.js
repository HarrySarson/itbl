'use strict';

var getIterator = require('./getIterator');

module.exports = toArray;



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
