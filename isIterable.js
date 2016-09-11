'use strict';

var definitions = require('./definitions');
  
var isFunction = require('lodash/isFunction');

module.exports = isIterable;

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
