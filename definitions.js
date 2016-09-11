'use strict'; 

var isSymbol = require('lodash/isSymbol');
var isFunction = require('lodash/isFunction');
 

module.exports = definitions;
 

var supported = typeof Symbol !== 'undefined' && Symbol != null && isSymbol(Symbol.iterator),
    itSymb = supported ? Symbol.iterator : null;
  
function definitions(addTo) {
 
  /**
   * Read only boolean value indicating whether es6 iterators are supported.
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @property {boolean}
   * @name nativeIterators
   *
   * <table>
   *   <tr>
   *   <td colspan="2">Property attributes of <code>nativeIterators</code></td>
   *   </tr>
   *   <tr> <td>Writable</td> <td>no</td> </tr> 
   *   <tr> <td>Enumerable</td> <td>yes</td> </tr> 
   *   <tr> <td>Configurable</td> <td>no</td> </tr> 
   * </table>
   */
  Object.defineProperty(addTo, 'nativeIterators', {
    value: supported,
    enumerable: true,
    configurable: false,
    writable: false
  });


  /**
   * Symbol or string used by libary to access iterator method, 
   * defaults to `es6`'s `Symbol.iterator`.
   * Can be overwritten by a symbol or by any non-null value convertable 
   * to a string to allow polyfilled support for iterators.
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @property {string|Symbol}
   * @name iteratorSymbol
   *
   * <table>
   *   <tr>
   *   <td colspan="2">Property attributes of <code>iteratorSymbol</code></td>
   *   </tr>
   *   <tr> <td>Writable</td> <td>yes</td> </tr> 
   *   <tr> <td>Enumerable</td> <td>yes</td> </tr> 
   *   <tr> <td>Configurable</td> <td>no</td> </tr> 
   * </table>
   */
  Object.defineProperty(addTo, 'iteratorSymbol', {
    get: function() { return itSymb; },
    set: function(v) { 
      itSymb = isSymbol(v) 
          ? v 
          : v == null || !isFunction(v.toString) 
            ? null 
            : v + ''; 
    }, 
    enumerable: true,
    configurable: false
  });
}

// add definitions to module but also export function that
// will add definitions to other objects.

definitions(definitions);



