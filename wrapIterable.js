'use strict';

var definitions = require('./definitions');
var wrapIterator = require('./wrapIterator');
var Wrapper = require('./Wrapper');


module.exports = wrapIterable;


// the es6 way to implement this class probabaly uses Proxy.


/**
 * Wraps an iterable, adding chainable itbl methods.
 * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to the iterable protocol.
 *
 * **Note**: There is no error checking.
 *
 * @private
 * @static
 * @memberOf itbl
 * @since 0.1.0
 * @param {iterable} iterable Iterable to wrap.
 * 
 * @return {itbl.Wrapper} Wrapped iterable.
 *
 */
function wrapIterable(iterable) {
  
  
  var wrapper = new Wrapper();
    
  wrapper[definitions.iteratorSymbol] = function() {
    return wrapIterator(iterable[definitions.iteratorSymbol]());
  };

  return wrapper;
  
}

