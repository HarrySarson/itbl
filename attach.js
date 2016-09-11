'use strict';

var GeneratedIterable = require('./GeneratedIterable');
var getIterator = require('./getIterator');
var Wrapper = require('./Wrapper');

var parseIteratee = require('lodash/iteratee');


module.exports = attach;

/**
 * Attaches `iteratee` to the iterators of `iterable` so that, during iteration, `iteratee` is invoked 
 * with the relavant value at every incrementation of `iterable`'s iterator.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterable} iterable Iterable whose values to invoke `iteratee` with.
 * @param {Function} [iteratee = _.identity] Function to invoke at each value.
 *
 * @returns {itbl.Wrapper} Returns wrapped (but otherwise unchanged) Iterable
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * [...itbl.attach([1, 2], function(n) {
 *    console.log(n*n)
 * })];
 * // => `[1, 2]`, Logs `1` then `4`.
 *
 * let myMap = new Map().set('a', 1).set('b', 2).set('c', 1);
 *
 * let itbl = itbl.attach(myMap, function(pair) {
 *   console.log(pair[0] + ': ' + pair[1]);
 * });
 * 
 * let it = itbl[Symbol.iterator];
 * 
 * it.next(); // => `['a',1]`, Logs `'a': 1`.
 * it.next()  // => `['b',2]`, Logs `'b': 2`.
 * it.next()  // => `['c',1]`, Logs `'c': 1`.
 *
 * // or
 * 
 * itbl = itbl.attach(myMap.keys(), function(key) {
 *   console.log(key + ': ' + myMap.get(key));
 * });
 * 
 * let it = itbl[Symbol.iterator];
 * 
 * it.next(); // => `'a'`, Logs `'a': 1`.
 * it.next()  // => `'b'`, Logs `'b': 2`.
 * it.next()  // => `'c'`, Logs `'c': 1`.
 */
function attach(iterable, iteratee) {
    
  iteratee = parseIteratee(iteratee);
     
  return GeneratedIterable(function() {
    
    var it = getIterator(iterable);
    
    return {
      
      next: function MappedIterator() {
        
        var step = it.next();
        
        if( !step.done )
          iteratee(step.value);
          
        return step;
      }      
    };
    
  })      
}

Wrapper.prototype.attach = function(iteratee) {
  return attach(this, iteratee);
};


