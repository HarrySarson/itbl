'use strict';

var GeneratedIterable = require('./GeneratedIterable');
var getIterator = require('./getIterator');
var isIterable = require('./isIterable');
    
var mapValues = require('lodash/mapValues');
var reduce = require('lodash/reduce');

module.exports = combine;

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
 
 