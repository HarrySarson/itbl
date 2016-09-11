'use strict';

var isIterable = require('./isIterable');
var isIterator = require('./isIterator');
var definitions = require('./definitions');
var wrapIterator = require('./wrapIterator');


module.exports = getIterator;

/**
 * Gets iterator from `iterable`. In `es6` environments using default value of `itbl.iteratorSymbol` when
 * `iterable` is a valid iterator, this is equivilent to calling `iterable[Symbol.iterator]`. This function includes
 * support for different values of `itbl.iteratorSymbol` and helpful error messages.
 *
 * If `iterable == null` then an 'done' iterator is returned.
 *
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {Iterable} [iterable = []] Iterable to get iterator to.
 *
 * @returns {itbl.Wrapper} An iterator
 * @throws {Error} Throws an error if iterators are not supported or the argument is not iterable.
 *
 * @example
 *
 * let it = itbl.getIterator([1,2,3]);
 *
 * it.next() // { value: 1, done: false }
 * it.next() // { value: 2, done: false }
 * it.next() // { value: 3, done: false }
 * it.next() // { value: undefined, done: true }
 *
 */
function getIterator(iterable) {
  
  if( definitions.iteratorSymbol == null )
    throw new Error('itbl: Iterators are natively not supported, set itbl.iteratorSymbol to use iterators');  
         
  if( iterable === undefined )
    return { 
      next: function() { return { done: true }; } 
    };
  
  if( !isIterable(iterable) )
    throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method not defined).');
  
  var iterator = iterable[definitions.iteratorSymbol]();
    
  if( !isIterator(iterator) )
    throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method does not return an iterator.');

  return wrapIterator(iterator);    
  
}
 