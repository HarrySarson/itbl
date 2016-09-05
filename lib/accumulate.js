'use strict';

var GeneratedIterable = require('./GeneratedIterable'),
    getIterator = require('./getIterator'),
    Wrapper = require('./Wrapper');

var parseIteratee = require('lodash/iteratee');

module.exports = accumulate;

/**
 * Creates an iterable whose iterators accumulate the values contained in `iterable` as they are
 * iterated. The values are the result of running the relevant value of `iterable` through `iteratee`, 
 * along with the previous value of the accumulated iterator. 
 *
 * If `initial` is not given, the first value of `iterable` is used as the initial value. 
 * The iteratee is invoked with 2 arguments: (accumulator, value). 
 *
 *
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to reduce values of.
 * @param {Function} [iteratee = _.identity] Function to run each value though.
 * @param [initial] Initial Value
 *
 * @returns Returns the accumalated value.
 * @throws {Error} Throws an error if iterators are not supported or the argument is not iterable.
 *
 * @example
 * 
 * // uses first value as initial value
 * [...IteratorUtil.accumulate([1, 2, 3, 4], function(sum, n) {
 *   return sum + n;
 * })];
 * // => [1, 3, 6, 10]
 *
 * let myMap = new Map().set('a', 1).set('b', 2).set('c', 1);
 *
 * let itbl = IteratorUtil.accumulate(myMap, function(result, pair) {
 *   let arr = result.get(pair[1]);
 *
 *   if( arr === undefined )
 *     result.set(pair[1], arr = []);
 *   
 *   arr.push(pair[0]);
 *   return result;
 * }, new Map());
 *
 * // or
 * 
 * itbl = IteratorUtil.accumulate(myMap.keys(), function(result, key) {
 *   let value = myMap.get(key),
 *       arr = result.get(value);
 *
 *   if( arr === undefined )
 *     result.set(value, arr = []);
 *   
 *   arr.push(key);
 *   return result;
 * }, new Map());
 *
 *
 * let it = itbl[Symbol.iterator];
 *
 * it.next();
 * // => `{ value: { '1': ['a'] }, done: false }`
 * it.next();
 * //=> `{ value: { '1': ['a'], '2', ['b'] }, done: false }`
 * it.next();
 * //=> `{ value:{ '1': ['a', 'c'], '2': ['b'] }, done: false }` 
 *
 */
function accumulate(iterable, iteratee, initial) {
  
  iteratee = parseIteratee(iteratee);
  
  var firstValueAsInitial = arguments.length < 3;
  
  return GeneratedIterable(function() {
  
    var setInitialToValue = firstValueAsInitial,
        it = getIterator(iterable),
        step;
    
    return {
      
      next: function MappedIterator() {
        
        var step = it.next();
                
        if( step.done )
          return { done: true };
        else
        {
          if( setInitialToValue )
          {
            initial = step.value;
            setInitialToValue = false;
          }
          else
          {
            initial = iteratee(initial, step.value);
          }
          return { value: initial, done: false };
        }
      }      
    };
    
  });
}
 
 
Wrapper.prototype.accumulate = function(iteratee, initial) {
  if( arguments.length >= 2 )
    return accumulate(this, iteratee, initial);
  else
    return accumulate(this, iteratee);
};
 
 