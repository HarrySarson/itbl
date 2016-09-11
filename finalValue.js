'use strict';

var getIterator = require('./getIterator');

module.exports = finalValue;


/**
 * Gets and iterator from `iterable` and increments an iterator until 
 * `iterator.next().done === true`. The final value of the iterator is then returned. 
 * If `iterable` has no values, undefined is returned. 
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} iterable Iterable to get final value of.
 *
 * @returns {*} Final value of the iterator.
 * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
 *
 * @example
 *
 * itbl.finalValue([1,2,3,4,5,6,7]);
 * // => `7` (note much quicker to use _.last)
 * 
 * let mySet = new Set().add(1).add('a').add(NaN)
 *
 * itbl.finalValue(mySet);
 *  // => `NaN`
 */
function finalValue(iterable) {
      
  var it = getIterator(iterable);
  
  var value, step;
  
  while( !(step = it.next()).done )
    value = step.value;
  
  return value;

}
 
 