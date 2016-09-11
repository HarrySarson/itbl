'use strict';

var isFunction = require('lodash/isFunction');

module.exports = isIterator;

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

