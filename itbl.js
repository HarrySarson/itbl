
;(function() {
  'use strict';
  
  /** Do basic error checking */
  const ARGS_CHECK = true;
  
  /** Expose internal modules for testing */
  const EXPOSE_INTERNAL = true;
  
  /** check `Symbol`'s are supported */
  if( typeof Symbol === undefined )
    throw new Error('es6 Symbols are required for the itbl libary');
  
  /** Detect free variable `global` from Node.js. */
  const freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  const freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  
  
  /** Detect free variable `exports`. */
  const freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  const freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Used as a reference to the global object. */
  const root = freeGlobal || freeSelf || Function('return this')();
  
  /** Used to restore the original `itbl` reference in `itbl.noConflict`. */
  const oldItbl = root.itbl;
  
  /** Used to access `@@iterator` method */
  const iteratorSymbol = Symbol.iterator;
  
  /**
   * Function that returns the first argument it recieves
   * 
   * @private
   * @memberOf itbl
   * @since 2.0.0
   *
   * @param {*} value Any Value.   
   * 
   * @returns {boolean} Returns `value`
   * @noexcept
   */
  const identity = value => value;
  
  /**
   * Used to bind `this` and arguments to funciton
   * 
   */
  const funcBind = Function.prototype.bind;
  
  /**
   * Determine if a value is a function.
   * 
   * @see http://stackoverflow.com/a/17108198
   * 
   * @private
   * @memberOf itbl
   * @since 2.0.0
   *
   * @param {*} value Value to check if function.
   * 
   * @returns {boolean} Weather value is function or not.
   * @noexcept
   */
  const isFunction = value => typeof value === 'function';
   

  /** 
   * Base class with prototype containing chained itbl methods.
   * This class is returned by `itbl()` and `itbl.wrap()`.
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @constructor
   * @noexcept
   *
   */
  const Wrapper = function() {};
  
  
  /**
   * Checks if `value` is an iterator according to es6 iterator protocols.
   * An object is an iterator when it implements a next() method.
   * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterator
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @noexcept
   * @example
   *
   * function MyIterable() { }
   * MyIterable.prototype[Symbol.iterator] = function*(){
   *   while(true) yield 1;
   * }
   * 
   * let iterableInstance = new MyIterable();
   *
   * itbl.isIterable(iterableInstance);
   * // => false (this is an iterable but NOT an iterator)
   *
   * // generator function that is then called
   * itbl.isIterable(iterableInstance[Symbol.iterator]());
   * // => true (this is both an iterator and also iterable)
   *
   * itbl.isIterator([1, 2, 3][Symbol.iterator]());
   * // => true
   *
   * for(let i of ['a'])
   *   itbl.isIterator(i)
   * // => false (i is equal to 'a')
   */
  const isIterator = value => value != null && isFunction(value.next);
  

  /**
   * Checks if `value` is an iterable objectaccording to es6 iterator protocols.
   * In order to be iterable, an object must implement the @@iterator method,
   * meaning that the object (or one of the objects up its prototype chain) 
   * must have a property with a Symbol.iterator key which defines a function.
   * (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @noexcept
   * @example
   *
   * 
   * function MyIterable() { }
   * MyIterable.prototype[Symbol.iterator] = function*(){
   *   while(true) yield 1;
   * }
   * 
   * let iterableInstance = new MyIterable();
   *
   * itbl.isIterable(iterableInstance);
   * // => true
   *
   * // generator function that is then called
   * itbl.isIterable(iterableInstance[Symbol.iterator]());
   * // => true (this is both an iterator and also iterable)
   *
   * itbl.isIterable([1, 2, 3]);
   * // => true
   *
   * itbl.isIterable({1: 1, 2: 2, 3: 3});
   * // => false
   */
  const isIterable = value => value != null && isFunction(value[iteratorSymbol]);
    
  
  
  /**
   * Wraps an iterator, adding chainable itbl methods.
   * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to both the 
   * iterable protocol and the iterator protocol as well as defining the `return()`
   * and `throw()` methods if (and only if) `iterator` defines them.
   *
   * Use the methods parameter to overwrite the `next`, `return`, `throw` or 
   * `[Symbol.iterator]` methods of `iterator`, `this` is bound to `iterator`.
   *
   * **Note**: There is no error checking.
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {iterator} iterator Iterator to wrap.
   * @param {object} [methods = {}] Methods object
   * @param {function} [methods.next] Replacement `next` method
   * @param {function} [methods.return] Replacement `next` method
   * @param {function} [methods.throw] Replacement `next` method
   * @param {function} [methods[Symbol.iterator]] Replacement `[Symbol.iterator]` method
   * 
   * @return {itbl.Wrapper} Wrapped iterator.
   * @noexcept
   *
   */
  const wrapIterator = function wrapIterator(iterator, methods) {
      
    var wrapper = new Wrapper();
    
    methods = methods != null 
      ? methods
      : {};
                            
    wrapper.next = funcBind.call(
      methods.next != null
        ? methods.next
        : iterator.next,
      iterator
    );
            
    if( methods[iteratorSymbol] != null )
      wrapper[iteratorSymbol] = funcBind.call(methods[iteratorSymbol],  iterator);
    else if( iterator[iteratorSymbol] != null ) 
      wrapper[iteratorSymbol] = funcBind.call(iterator[iteratorSymbol], iterator);
    else
      wrapper[iteratorSymbol] = () => wrapper;
    
    if( methods.return != null )
      wrapper.return = funcBind.call(methods.return,  iterator);
    else if( iterator.return != null ) 
      wrapper.return = funcBind.call(iterator.return, iterator);
      
    if( methods.throw != null )
      wrapper.throw = funcBind.call(methods.throw,  iterator);
    else if( iterator.throw != null ) 
      wrapper.throw = funcBind.call(iterator.throw, iterator);
      
    return wrapper;
  }
  
  /**
   * Wraps an iterable, adding chainable itbl methods.
   * The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to the iterable protocol.
   *
   * The iterator returned by the `[Symbol.iterator]` method will be wrapped and so contain chainable
   * itbl methods.
   *
   * Use the methods parameter to overwrite the `next`, `return`, `throw` or 
   * `[Symbol.iterator]` methods of the iterator produced by `iterable`.
   *
   * **Note**: The objects returned by the `[Symbol.iterator]` method are checked to ensure that they are iterators.
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {iterable} iterable Iterable to wrap.
   * @param {object} [methods = {}] Methods object
   * @param {function} [methods.next] Replacement `next` method
   * @param {function} [methods.return] Replacement `next` method
   * @param {function} [methods.throw] Replacement `next` method
   * @param {function} [methods[Symbol.iterator]] Replacement `[Symbol.iterator]` method
   * 
   * @return {itbl.Wrapper} Wrapped iterable.
   * @throws Throws `Error` if the objects returned by the `[Symbol.iterator]` method are not iterators.
   *
   */
  const wrapIterable = function wrapIterable(iterable, methods) {

    var wrapper = new Wrapper();
      
    wrapper[iteratorSymbol] = function() {
      let iter = iterable[iteratorSymbol]();
      
      if( ARGS_CHECK && !isIterator(iter) )
        throw new Error('itbl: `[Symbol.iterator]` method has not returned an iterator');
    
      return wrapIterator(iterable[iteratorSymbol](), methods);
    };

    return wrapper;
    
  }
  
  /**
   * Wraps a generator function to produce a @link{itbl.Wrapper wrapped iterable}.
   * 
   * The generator function can be any function that returns an iterator, this includes functions
   * declared `function* gen() {}`.
   *
   * If the function produces independant iterators each time it is called (which `function*() { ... }` does)
   * then iterating over the created iterable wil not cause it to change, so it can be used multiple times.
   *
   * **Note**: The objects returned by the `generator` are checked to ensure that they are iterators.
   *
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {function} generator A function that returns iterators.
   *
   * @returns {itbl.Wrapper} An iterable.
   * @throws Throws `Error` if the objects returned by the `[Symbol.iterator]` method are not iterators.
   *
   */
  const generateIterable = generator => wrapIterable({ [iteratorSymbol]: generator });

  /**
   * Gets iterator from `iterable`. This is equivilent to calling `iterable[Symbol.iterator]` but
   * produces helpful error messages.
   *
   * If `iterable` is omitted then an 'empty' iterator is returned.
   *
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Iterable} [iterable = []] Iterable to get N iterator to.
   *
   * @returns {itbl.Wrapper} An iterator
   * @throws {Error} Throws an error if `iterable` is not iterable.
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
  const getIterator = function getIterator(iterable) {
     
    if( iterable === undefined )
      return { 
        next: function() { return { done: true }; } 
      };
    
    if( ARGS_CHECK && !isIterable(iterable) )
      throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method not defined).');
    
    let iterator = iterable[iteratorSymbol]();
      
    if( ARGS_CHECK && !isIterator(iterator) )
      throw new Error('itbl: argument `iterable` is not iterable as the [Symbol.iterator] method does not return an iterator.');

    return wrapIterator(iterator);    
    
  }
  
  
  /** 
   * Wraps an iterable, iterator, generator function (any function
   * that returns iterators), or a value to produce an objcet that conforms to the
   * iterable protocol (and iterator protocol if `value` is an iterator). 
   *
   * If a value is provided that is not an iterable or an iterator, or is a function that does
   * not return iterators, it (or its return value) is wrapped in an iterable so that `itbl(6)`
   * is equivalent to both `itbl(function() { return 6; })` and `itbl([6])`
   *
   * All itbl functions that take an iterable as their first parameter
   * and return an iterable are chainable and so can be called as methods of the
   * wrapped value.
   *
   * The chainable methods are:
   * 
   * `filter` and `map`.
   *
   * In custom builds, including a function in the build will attach that function
   * as a method to all wrapped values.
   *
   *
   * @static
   * @memberOf itbl
   * @alias itbl
   * @since 0.1.0
   * @param {*} value The value to wrap.
   *
   * @returns {itbl.Wrapper} An iterable which may also be an iterator.
   * @throws If `value` defines a `[Symbol.iterator]` method but that method does not
   * return valid iterators then an `Error` will be thrown when the wrapped iterable
   * is iterated over.
   *
   */
  const wrap = function wrap(value) {
    
    if( isIterator(value) )
      return wrapIterator(value);
    
    // note iterators may also be iterable but they are treated as iterators
    if( isIterable(value) )
      return wrapIterable(value);
    
    let result;
    
    if( isFunction(value) )
    {
      return generateIterable(function() {
        let iter = value();
        
        if( isIterator(iter) )
          return iter;
        
        else return [value][Symbol.iterator]();
      });
    }
    
    return wrapIterable([value])
  }
  
  /**
   * Creates a new iterable whose iterators will have values coresponding to the value
   * of the Iterator of the original iterable run through `iteratee`.
   * The iteratee is invoked with only one argument (value). 
   *
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Iterable} iterable Iterable to map values of.
   * @param {Function} [iteratee = _.identity] Function to run each value though.
   *
   * @returns {itbl.Wrapper} A new mapped iterable
   * @throws {Error} Throws an error if `iterable` is not iterable.
   *
   * @example
   *
   * for(let coor of itbl.map([0,1,2,3,4,5], x => ({ x, y: Math.exp(x)))) {
   *   context.lineTo(coor.x, coor.y);
   * }
   * 
   * let mySet = new Set().add(1).add('a').add(NaN)
   *
   * [...itbl.map(mySet, value => value + 1)]
   * // [2, 'a1', NaN]
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * [...itbl.map(users, _.property('user'));
   * // => ['barney', 'fred']
   *
   */
  const map = function map(iterable, iteratee) {
    
    iteratee = iteratee != null 
      ? iteratee
      : identity;
      
    if( ARGS_CHECK && !isIterable(iterable) )
      throw new Error('itbl.map: `iterable` does not define the `[Symbol.iterator]` method');
    
    return (isIterator(iterable)
      ? wrapIterator 
      : wrapIterable
    )(iterable, {
      next() {
        const step = this.next();
        let mapped;
        
        if( !step.done )
          mapped = iteratee(step.value);
        
        return {
          value: mapped,
          done: step.done,
        }
      },        
    });
  };
  
  Wrapper.prototype.map = function(iteratee) {
    return map(this, iteratee);
  };
   
  
  
  /**
   * Reverts the `itbl` variable to its previous value and returns a reference to
   * the `itbl` function.
   *
   * @static
   * @since 2.0.0
   * @memberOf itbl
   * @returns {Function} Returns the `itbl` function.
   * @example
   *
   * var IterableUtil = itbl.noConflict();
   */
  function noConflict() {
    if (root.itbl === this) {
      root.itbl = oldItbl;
    }
    return this;
  }

  /*--------------------------------------------------------------------------*/

  // Export itbl.
    
  let itbl = wrap;
   
  Object.assign(itbl, {
   
   isIterable,
   isIterator,
   itbl,
   noConflict,
   map,
   wrap,
   
 }, EXPOSE_INTERNAL
  ? {
    _wrapIterable: wrapIterable,
    _wrapIterator: wrapIterator,
    _generateIterable: generateIterable,
    _Wrapper: Wrapper,
  }
  : {});

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose itbl on the global object to prevent errors when itbl is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `itbl.noConflict` to remove Lodash from the global object.
    root.itbl = itbl;

    // Define as a module.
    define('itbl', function() {
      return itbl;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    freeModule.exports = itbl;
    // Export for CommonJS support.
    freeExports.itbl = itbl;
  }
  else {
    // Export to the global object.
    root.itbl = itbl;
  }
}.call(this));
