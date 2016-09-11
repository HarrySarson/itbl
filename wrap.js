'use strict';

var GeneratedIterable = require('./GeneratedIterable');
var wrapIterable = require('./wrapIterable');
var wrapIterator = require('./wrapIterator');
var isIterable = require('./isIterable');
var isIterator = require('./isIterator');
    
var constant = require('lodash/constant');
var isFunction = require('lodash/isFunction');

module.exports = wrap;

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