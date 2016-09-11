'use strict';

var definitions = require('./definitions');
var Wrapper = require('./Wrapper');

var isFunction = require('lodash/isFunction');
var bind = require('lodash/bind');
    


module.exports = wrapIterator;

// the es6 way to implement this class probabaly uses Proxy.

/**
 * Wraps an iterator, adding chainable itbl methods.
 * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to both the 
 * iterable protocol and the iterator protocol as well as defining the `return()`
 * and `throw()` methods if (and only if) `iterator` defines them.
 *
 * **Note**: There is no error checking.
 *
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterator} iterator Iterator to wrap.
 * 
 * @return {itbl.Wrapper} Wrapped iterator.
 *
 */
function wrapIterator(iterator) {
    
  var wrapper = new Wrapper();
                          
  wrapper.next = bind(iterator.next, iterator);
  
  wrapper[definitions.iteratorSymbol] = function() { return this; }  
  
  if( isFunction(iterator['return']) ) 
    wrapper['return'] = bind(iterator['return'], iterator);
     
  if( isFunction(iterator['throw']) )
    wrapper.throw = bind(iterator['throw'], iterator);
    
  return wrapper;
}

