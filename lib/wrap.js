var GeneratedIterable = require('./GeneratedIterable'),
    NiceIterable = require('./NiceIterable'),
    NiceIterator = require('./NiceIterator'),
    isIterable = require('./isIterable'),
    isIterator = require('./isIterator');
    
var constant = require('lodash/constant');
var isFunction = require('lodash/isFunction');

module.exports = wrap;

/** 
 * Wraps an iterable, iterator, generator function (any function
 * that returns iterators), or a value to produce an objcet that conforms to the
 * iterable protocol (and iterator protocol if `value` is an iterator). 
 *
 * If a value is provided that is not an iterable or an iterator, or is a function that does
 * not return iterators, it (or its return value) is wrapped in an iterable so that `IteratorUtil(6)`
 * is equivilent to both `IteratorUtil(function() { return 6; })` and `IteratorUtil([6])`
 *
 * All IteratorUtil functions that take an iterable as their first parameter
 * and return an iterable are chainable and so can be called as methods of the
 * wrapped value.
 *
 * The chainable methods are:
 * 
 * `accumulate`, `attach`, `filter` and `map`.
 *
 * In custom builds, including a function in the build will attach that function
 * as a method to all wrapped values.
 *
 *
 * @private
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {*} value The value to wrap.
 *
 * @returns {IteratorUtil.NiceIterable|IteratorUtil.NiceIterable} An iterable or an iterator.
 *
 */
function wrap(value) {
  
  if( isIterator(value) )
    return NiceIterator(value);
  
  // note iterators may also be iterable but they are treated as iterators
  if( isIterable(value) )
    return NiceIterable(value);
  
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