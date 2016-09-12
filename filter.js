'use strict';

var generateIterable = require('./generateIterable');
var getIterator = require('./getIterator');
var Wrapper = require('./Wrapper');

var parseIteratee = require('lodash/iteratee');

module.exports = filter;

/**
 * Creates a new iterable containing values which the `predicate` returns truthy for. 
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to filter the values of.
 * @param {Function} [predicate = _.identity] Function to run each value though.
 *
 * @returns {itbl.Wrapper} New filtered iterable
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * [...itbl.filter([0,1,2,3,4,5], val => val%2 === 0)]
 * // [0,2,4]
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * [...itbl.filter(mySet, value => _.isFinite)]
 * // [1]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * [...itbl.filter(users, function(o) { return !o.active; })];
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * [...itbl.filter(users, { 'age': 36, 'active': true })];
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * [...itbl.filter(users, ['active', false])];
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * [...itbl.filter(users, 'active')];
 * // => objects for ['barney']
 *
 */
function filter(iterable, predicate) {

  predicate = parseIteratee(predicate);
    
  
  return generateIterable(function() {
    
    var it = getIterator(iterable);
    
    return {
      
      next: function FilteredIterator() {
        
        var step;

        while( !(step = it.next()).done && !predicate(step.value) );
        
        if( step.done )
          return { done: true };
        else
          return { value: step.value, done: false };
      }      
    };
    
  });
}


Wrapper.prototype.filter = function(predicate) {
  return filter(this, predicate);
};
 