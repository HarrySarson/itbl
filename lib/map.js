'use strict';

var GeneratedIterable = require('./GeneratedIterable'),
    getIterator = require('./getIterator'),
    Wrapper = require('./Wrapper');
    
var parseIteratee = require('lodash/iteratee');


module.exports = map;

// TODO make sure iterator is closed if mapping is interupted

/**
 * Creates a new iterable whose iterators will have values coresponding to the value
 * of the Iterator of the original iterable run through `iteratee`.
 * The iteratee is invoked with only one argument (value). 
 *
 *
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to map values of.
 * @param {Function} [iteratee = _.identity] Function to run each value though.
 *
 * @returns {IteratorUtil.NiceIterable} New mapped iterable
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * for(let coor of IteratorUtil.map([0,1,2,3,4,5], x => ({ x, y: Math.exp(x)))) {
 *   context.lineTo(coor.x, coor.y);
 * }
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * [...IteratorUtil.map(mySet, value => value + 1)]
 * // [2, 'a1', NaN]
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * [...IteratorUtil.map(users, 'user');
 * // => ['barney', 'fred']
 *
 */
function map(iterable, iteratee) {
  
  iteratee = parseIteratee(iteratee);
    
  return GeneratedIterable(function() {
    
    var it = getIterator(iterable);
    
    return {
      
      next: function MappedIterator() {
        
        var step = it.next();
        
        if( step.done )
          return { done: true };
        else
          return { value: iteratee(step.value), done: false };
      }      
    };
    
  });
}
 
Wrapper.prototype.map = function(iteratee) {
  return map(this, iteratee);
};
 