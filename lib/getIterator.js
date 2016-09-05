'use strict';

var isIterable = require('./isIterable'),
    isIterator = require('./isIterator'),
    definitions = require('./definitions'),
    NiceIterator = require('./NiceIterator');


module.exports = getIterator;

/**
 * Gets iterator from `iterable`. In `es6` environments using default value of `IteratorUtil.iteratorSymbol` when
 * `iterable` is a valid iterator, this is equivilent to calling `iterable[Symbol.iterator]`. This function includes
 * support for different values of `IteratorUtil.iteratorSymbol` and helpful error messages.
 *
 * If `iterable == null` then an 'done' iterator is returned.
 *
 *
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {Iterable} [iterable = []] Iterable to get iterator to.
 *
 * @returns {IteratorUtil.NiceIterator} An iterator
 * @throws {Error} Throws an error if iterators are not supported or the argument is not iterable.
 *
 * @example
 *
 * let it = IteratorUtil.getIterator([1,2,3]);
 *
 * it.next() // { value: 1, done: false }
 * it.next() // { value: 2, done: false }
 * it.next() // { value: 3, done: false }
 * it.next() // { value: undefined, done: true }
 *
 */
function getIterator(iterable) {
  
  if( definitions.iteratorSymbol == null )
    throw new Error('IteratorUtil: Iterators are natively not supported, set IteratorUtil.iteratorSymbol to use iterators');  
         
  if( iterable === undefined )
    return { 
      next: function() { return { done: true }; } 
    };
  
  if( !isIterable(iterable) )
    throw new Error('IteratorUtil: argument `iterable` is not iterable as the iterator method not defined).');
  
  var iterator = iterable[definitions.iteratorSymbol]();
    
  if( !isIterator(iterator) )
    throw new Error('IteratorUtil: argument `iterable` is not iterable as the iterator method does not return an iterator.');

  return NiceIterator(iterator);    
  
}
 