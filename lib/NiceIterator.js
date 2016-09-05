'use strict';

var definitions = require('./definitions'),
    Wrapper = require('./Wrapper');

var isFunction = require('lodash/isFunction');
var bind = require('lodash/bind');
    


module.exports = NiceIterator;

// the es6 way to implement this class probabaly uses Proxy.

/**
 * Wraps an iterator, adding chainable IteratorUtil methods.
 * The `NiceIterator` object will conform to both the iterable protocol 
 * and the iterator protocol as well as defining the `return()`
 * and `throw()` methods if (and only if) the iterator defines them.
 *
 * **Note**: There is no error checking.
 *
 * @private
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {iterator} iterator Iterator to wrap.
 * 
 * @return {IteratorUtil.Wrapper} Wrapped iterator.
 *
 */
function NiceIterator(iterator) {
    
  var wrapper = new Wrapper();
    
  wrapper.next = bind(iterator.next, iterator);
  
  wrapper[definitions.iteratorSymbol] = function() { return this; }  
  
  if( isFunction(iterator['return']) ) 
    wrapper['return'] = bind(iterator['return'], iterator);
     
  if( isFunction(iterator['throw']) )
    wrapper.throw = bind(iterator['throw'], iterator);
    
  return wrapper;
}

