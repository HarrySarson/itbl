'use strict';

var definitions = require('./definitions'),
    NiceIterator = require('./NiceIterator'),
    Wrapper = require('./Wrapper');


module.exports = NiceIterable;


// the es6 way to implement this class probabaly uses Proxy.


/**
 * Wraps an iterable, adding chainable IteratorUtil methods.
 * `NiceIterable` objects will conform to the iterable protocol.
 *
 * **Note**: There is no error checking.
 *
 * @private
 * @static
 * @memberOf IteratorUtil
 * @since 0.1.0
 * @param {iterable} iterable Iterable to wrap.
 * 
 * @return {IteratorUtil.Wrapper} Wrapped iterable.
 *
 */
function NiceIterable(iterable) {
  
  
  var wrapper = new Wrapper();
    
  wrapper[definitions.iteratorSymbol] = function() {
    return NiceIterator(iterable[definitions.iteratorSymbol]());
  };

  return wrapper;
  
}

