
;(function() {
  'use strict';

  /** Do basic error checking */
  const ARGS_CHECK = true;

  /** Expose internal modules for testing */
  const EXPOSE_INTERNAL = true;

  /** check `Symbol`'s are supported */
  if( typeof Symbol === `undefined` )
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
   * Creates an iterable containing only `value`.
   *
   * @private
   * @memberOf itbl
   * @since 2.0.0
   *
   * @param {*} value Any Value.
   *
   * @returns {itbl} Returns an wrapped iterator containing only `value`.
   * @noexcept
   */
  const singleIterable = value => _wrapIterable([value]);
  /**
   * Creates an iterator containing only `value`.
   *
   * @private
   * @memberOf itbl
   * @since 2.0.0
   *
   * @param {*} value Any Value.
   *
   * @returns {itbl} Returns an wrapped iterator containing only `value`.
   * @noexcept
   */
  const singleIterator = value => _wrapIterator([value][iteratorSymbol]());

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
  const _isFunction = value => typeof value === 'function';

  /**
   * @typedef {{ value: *, done: boolean }} Step
   */

  /**
   * Base class with prototype containing chained itbl methods.
   * This class is returned by `itbl()` and `itbl.wrap()`.
   *
   * @static
   * @extends Iterable
   * @memberOf itbl
   * @since 0.1.0
   * @constructor
   * @noexcept
   *
   */
  const _Wrapper = function() {};

  /**
   * @name [Symbol.iterator]
   *
   * Get an iterator to the wrapped iterable.
   *
   * @memberof itbl
   * @since 2.0.0
   * @returns {itbl} Returns a wrapped iterator.
   *
   * @throws Throws if the wrapped value is an iterator or an iterable whose [Symbol.iterator]
   * method throws.
   */

  /**
   * @name next
   *
   * Get the next value of this iterator
   * 
   * ** This method is only defined if the wrapped value is an iterator **
   *
   * @memberof itbl
   * @since 2.0.0
   * @returns {Step} Returns the next iterator value.
   * @throws Throws if the wrapped iterator's next method throws.
   *
   */

  /**
   * @name return
   *
   * Returns given value and finishes the iterator.
   *
   * ** This method is only defined if the wrapped value is defines a return method  **
   *
   * @memberof itbl
   * @since 2.0.0
   *
   * @param {*} value The value to return
   *
   * @returns {Step} Returns a `{@link Step}` with a value of `value`.
   * @throws Throws if the wrapped iterator's return method throws.
   *
   */

  /**
   * @name throw
   *
   * The throw() method resumes the execution of a generator by throwing an error into it and returns an
   * object with two properties done and value.
   *
   * ** This method is only defined if the wrapped value is an iterator **
   *
   * @memberof itbl
   * @since 2.0.0
   *
   * @param {*} exception The exception to throw. For debugging purposes, it is useful to make it an `instanceof
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error}`.
   *
   * @returns {Step} Returns the next iterator value.
   * @throws Throws if the wrapped iterator's return method throws, for a generator function this happens if the
   * yield expression is not contained within a try-catch block.
   *
   */


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
  const isIterator = value => value != null && _isFunction(value.next);


  /**
   * Checks if `value` is an iterable object according to es6 iterator protocols.
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
  const isIterable = value => value != null && _isFunction(value[iteratorSymbol]);



  /**
   * Wraps an iterator, adding chainable itbl methods.
   * The `itbl` objects returned by `_wrapIterable()` will conform to both the
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
   * @param {Iterator} iterator Iterator to wrap.
   * @param {function} [methods.next] Replacement `next` method
   * @param {function} [methods.return] Replacement `next` method
   * @param {function} [methods.throw] Replacement `next` method
   * @param {function} [methods[Symbol.iterator]] Replacement `[Symbol.iterator]` method
   *
   * @return {itbl} Wrapped iterator.
   * @noexcept
   *
   */
  const _wrapIterator = function _wrapIterator(iterator, methods) {

    var wrapper = new _Wrapper();

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
  };

  /**
   * Wraps an iterable, adding chainable itbl methods.
   * The `itbl` objects returned by `_wrapIterable()` will conform to the iterable protocol.
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
   * @param {Iterable} iterable Iterable to wrap.
   * @param {function} [methods.next] Replacement `next` method
   * @param {function} [methods.return] Replacement `next` method
   * @param {function} [methods.throw] Replacement `next` method
   * @param {function} [methods[Symbol.iterator]] Replacement `[Symbol.iterator]` method
   *
   * @return {itbl} Wrapped iterable.
   * @throws Throws `Error` if the objects returned by the `[Symbol.iterator]` method are not iterators.
   *
   */
  const _wrapIterable = function _wrapIterable(iterable, methods) {

    var wrapper = new _Wrapper();

    wrapper[iteratorSymbol] = function() {
      let iter = iterable[iteratorSymbol]();

      if( ARGS_CHECK && !isIterator(iter) )
        throw new Error('itbl: `[Symbol.iterator]` method has not returned an iterator');

      return _wrapIterator(iter, methods);
    };

    return wrapper;

  };

  /**
   * Wraps a generator function to produce a @link{itbl wrapped iterable}.
   *
   * The generator function can be any function that returns an iterator, this includes functions
   * declared `function* gen() {}`.
   *
   * If the function produces independent iterators each time it is called (which `function*() { ... }` does)
   * then iterating over the created iterable wil not cause it to change, so it can be used multiple times.
   *
   * **Note**: The objects returned by the `generator` are checked to ensure that they are iterators and
   * wrapped by in an itbl instance.
   *
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {function} generator A function that returns iterators.
   *
   * @returns {itbl} An iterable.
   * @throws Throws `Error` if the objects returned by the `[Symbol.iterator]` method are not iterators.
   *
   */
  const _generateIterable = generator => _wrapIterable({ [iteratorSymbol]: generator });


  /**
   * Gets iterator from `iterable`. This is equivalent to calling `iterable[Symbol.iterator]` but
   * produces helpful error messages.
   *
   * If `iterable` is omitted then an 'empty' iterator is returned.
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Iterable} iterable Iterable to get N iterator to.
   * @param {String} funcName Name of function to blame error on.
   * @param {String} iterableName Name of `iterable` to include in error message;
   *
   * @returns {itbl} An iterator
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
  const _getIterator = function _getIterator(iterable, funcName, iterableName) {

    if( ARGS_CHECK && !isIterable(iterable) )
      throw new Error(`\`itbl.${funcName}()\`: ${iterableName} is not iterable as the [Symbol.iterator] method not defined).`);

    let iterator = iterable[iteratorSymbol]();

    if( ARGS_CHECK && !isIterator(iterator) )
      throw new Error(`itbl: ${iterableName} is not iterable as the [Symbol.iterator] method does not return an iterator.`);

    return _wrapIterator(iterator);

  };


  /**
   * Wraps any value to produce an object that conforms to the
   * iterable protocol and - if `value` is an iterator - the iterator protocol.
   *
   * If `value` is an iterable or an iterator, then `value` will be wrapped in an
   * instance of `itbl`.
   *
   * If `value` is not an iterable, an iterator or a function then an iterable containing
   * `value` will be created and wrapped in an instance of `itbl`.
   *
   * If `value` is a function, an iterable instance of `itbl` will be returned.
   * When the `[Symbol.iterator]` method is called,  `value` will be invoked.
   * - If `value` returns an iterator it will be wrapped
   * - If `value` returns an iterable then its
   * `[Symbol.iterator]` method will be called and that iterator wraped.
   * - If 'value' returns any other value (including a function) then an iterable
   * containing that value will be created, its `[Symbol.iterator]` method called
   * and that iterator wrapped.
   *
   * Therefore all of these are roughly equivalent
   * ```javascript
   * itbl([6]);
   * itbl(6);
   * itbl(function() { return 6; });
   * itbl(function() { return [6]; });
   * itbl(function() { return [6][Symbol.iterator](); });
   *
   * // this can only be iterated over once, unlike all the above
   * itbl([6][Symbol.iterator]());
   * ```
   *
   * As `value` will be invoked if it is a function, if an iterable containing a
   * function is required then the function should be explicitly wrapped in an iterable
   * (e.g. `itbl([function() {...}])`).
   *
   * All itbl functions that take an iterable as their first parameter
   * and return an iterable are chainable and so can be called as methods of the
   * wrapped value.
   *
   * The chainable methods are:
   *
   * `filter` and `map`.
   *
   * In custom builds, including a function in the build will that function chainable.
   * ```javascript
   * // require libraries, (order is not important)
   * let wrap = require('itbl/wrap');
   * let map = require('itbl/map');
   *
   * // map a chainable function
   * let result = wrap(...).map(function(i) { ... });
   * ```
   *
   * @static
   * @name itbl
   * @alias wrap
   * @since 0.1.0
   * @param {*} value The value to wrap.
   *
   * @returns {itbl} An iterable which may also be an iterator.
   * @throws If `value` defines a `[Symbol.iterator]` method but that method does not
   * return valid iterators then an `Error` will be thrown when the wrapped iterable
   * is iterated over.
   *
   * @example
   * let students = [
   *   {
   *     name: 'Martin Smith',
   *     subject: 'Maths',
   *   },
   *   {
   *     name: 'John Arthur',
   *     subject: 'English',
   *   },
   *   {
   *     name: 'Rachel Richardson',
   *     subject: 'Maths',
   *   },
   * ];
   *
   * // get the name of all maths students
   * let mathematicians = itbl(students)
   *  .filter(_.matchesProperty('subject', 'Maths'))
   *  .map(_.property('name'));
   *
   * [...mathematicians]
   * // -> ['Martin Smith', 'Rachel Richardson']
   *
   * let arr = [1, 7, 8, 9];
   *
   * let arrayReverse = function arrayReverse(array) {
   *   return itbl(function* () {
   *     let i = array.length-1;
   *     while(i >= 0) {
   *       yield array[i];
   *       i--;
   *     }
   *   });
   * };
   *
   * [...arrayReverse(arr)];
   * // -> [9, 8, 7, 1]
   *
   */
  const wrap = function wrap(value) {

    if( value instanceof _Wrapper )
      return value;

    if( isIterator(value) )
      return _wrapIterator(value);

    // note iterators may also be iterable but they are treated as iterators
    if( isIterable(value) )
      return _wrapIterable(value);


    if( _isFunction(value) )
    {
      return _generateIterable(function() {
        let result = value();

        if( isIterator(value) )
          return result;

        // get iterator from iterable
        if( isIterable(result) )
          return result[iteratorSymbol]();

        else return singleIterator(result);
      });
    }

    return singleIterable(value)
  };


  /**
   * Creates a new iterable whose iterators will have values corresponding to the value
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
   * @returns {itbl} A new mapped iterable
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
      ? _wrapIterator
      : _wrapIterable
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

  _Wrapper.prototype.map = function(iteratee) {
    return map(this, iteratee);
  };

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
   * @returns {itbl} New filtered iterable
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
   * [...itbl.filter(users, _.matches({ 'age': 36, 'active': true }))];
   * // => objects for ['barney']
   *
   * [...itbl.filter(users, _.matchesProperty('active', false))];
   * // => objects for ['fred']
   *
   * [...itbl.filter(users, _.property('active'))];
   * // => objects for ['barney']
   *
   */
  const filter = function filter(iterable, predicate) {

    predicate = predicate != null
        ? predicate
        : identity;

    if( ARGS_CHECK && !isIterable(iterable) )
      throw new Error('itbl.filter: `iterable` does not define the `[Symbol.iterator]` method');

    return (isIterator(iterable)
            ? _wrapIterator
            : _wrapIterable
    )(iterable, {
      next() {
        let step;

        while( !(step = this.next()).done && !predicate(step.value) ) {}

        return step;
      },
    });
  };

  _Wrapper.prototype.filter = function(predicate) {
    return filter(this, predicate);
  };

  /**
   * Combines the iterables in `iterable` into a single iterable containing iterables
   * of values from each iterable in `iterable`.
   *
   * ** `iterable` is not checked to see if it is actually an iterable. **
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Iterable} iterable Collection of iterators
   *
   * @returns {itbl} Iterable containing collection of values
   * @throws {Error} Throws an error if the values of `iterable` are not iterable.
   *
   */
  function _iterableCombine(iterable) {
    let n = 0;

    let iterators = [...itbl.map(iterable, iterableValue =>
      _getIterator(iterableValue, 'combine', `${++n}th value of \`collection\``)
    )];

    let returnValues = [];

    return function() {

      let values = [],

          anyDone = false,
          allDone = true,
          i = 0;

      for( let step of iterators.map(iterator => iterator.next()) ) {

        returnValues[i] = step.done ? step.value : returnValues[i];

        values.push(     !step.done ? step.value : undefined    );

        anyDone = anyDone || step.done;
        allDone = allDone && step.done;


        // TODO don't like having index variable in for-of loop
        ++i;
      }

      return { values, returnValues, anyDone, allDone };
    };
  }


  /**
   * Combines all `object`'s own enumerable values (which must be iterators) into a single iterable containing objects
   * containing values from each iterable in `object`.
   *
   *
   *
   * @private
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Object} object Collection of iterators
   *
   * @returns {itbl} Iterable containing collection of values.
   * @throws {Error} Throws an error if any own enumerable values of `object` are not enumerable.
   *
   */
  function _objectCombine(object) {

    let iterators = {};


    for( let key of Object.keys(object) ) {
      iterators[key] = _getIterator(object[key], 'combine', `\`collection.${key}\` is not an iterator`);
    }
    let returnValues = {};

    return function() {

      let values = {},

          anyDone = false,
          allDone = true;

      for( let key of Object.keys(iterators) )
      {
        let step = iterators[key].next();

        returnValues[key] =  step.done ? step.value : returnValues[key];

        values      [key] = !step.done ? step.value : undefined;

        anyDone = anyDone || step.done;
        allDone = allDone && step.done;

      }

      return { values, returnValues, anyDone, allDone };
    };
  }

  /**
   * Combines the iterables in `collection` into a single iterable containing collections
   * of values from each iterable in `collection`.
   *
   * `collection` can either be an Iterable or an object containing Iterables which
   * will be combined. The first value in the combined Iterable will be an Iterable or
   * an object containing the first values of the Iterables in `collection`, the second
   * value containing the second values of the Iterables in `collection` and so on.
   *
   * The value of `finish` determines when the iteration ends.
   *
   * * If `finish === 'early' or 'e'` (default) then the iteration ends as soon as the first iterator from
   * `collection` ends.
   *
   * * If `finish === 'late' or 'l'` then the iteration continues untill all iterators from `collection` are done.
   * Values corresponding to iterators that have ended are `undefined`.
   *
   * * If `finish === 'together' or 't'` then all iterators from `collection` must finish on the same iteration or
   * else an `Error` is thrown.
   *
   * **Note**: The return value of the iterator is a collection of the of the return values the iterators
   * from `collection`. Return values corresponding to iterators that have not yet ended are `undefined`
   *
   * `combine` is particularly powerful when used with
   * [es6 destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
   *
   * @static
   * @memberOf itbl
   * @since 0.1.0
   * @param {Iterable|Object} collection Collection of iterators
   * @param {string} [finish = 'early'] Flag determining when iteration will finish.
   *
   * @returns {itbl} Iterable containing collection of values
   * @example
   *
   * let mySet = new Set();
   * mySet.add(1);
   * mySet.add(Math);
   *
   * [...itbl.combine([['a','b','c'], mySet, ['alpha','beta', 'gamma']])];
   * // -> [['a', 1, 'alpha'], ['b', Math, 'beta']]
   *
   * // with `finish === late`
   * [...itbl.combine([['a','b','c'], ['alpha','beta', 'gamma'], mySet], 'late')];
   * // [['a', 1, 'alpha'], ['b', Math, 'beta'], ['c', undefined, 'gamma']]
   *
   * let coordinates = itbl.combine({
   *   x: [1,2,3,4,5],
   *   y: [1,4,9,16,25],
   * });
   *
   * for(let coor of coordinates) {
   *   context.lineTo(coor.x, coor.y);
   * }
   *
   * // more concise syntax using object destructuring
   * for(let {x, y} of coordinates) {
   *   context.lineTo(x,y);
   * }
   *
   */
  const combine = function combine(collection, finish) {
    // TODO potential infinite loop if an iterator changes it's mind about whether it is done or not
    let finishLate = false,
        finishTogether = false;

    switch(finish) {
      case undefined:
      case null:
      case 'e':
      case 'early':
        break;
      case 'l':
      case 'late':
        finishLate = true;
        break;
      case 't':
      case 'together':
        finishTogether = true;
        break;
      default:
        throw new Error('`itbl.combine()`: `finish` is not recognised');
    }

    let combiningFunction = isIterable(collection)
        ? _iterableCombine
        : _objectCombine;

    return _generateIterable(function() {

      let rawCombined = combiningFunction(collection);

      return {
        next: function() {

          let { values, returnValues, anyDone, allDone } = rawCombined();


          if( (!finishLate && anyDone) || allDone )
          {
            if( finishTogether && !allDone )
              throw new Error("`itbl.combine()`: iterables combined with `finish === 'together'` have not finished together");

            return {
              value: returnValues,
              done: true,
            };
          }
          else
            return {
              value: values,
              done: false,
            };
        },
      };
    });

  };

  /**
   * Reverts the `itbl` variable to its previous value and returns a reference to
   * the `itbl` function.
   *
   * @static
   * @since 2.0.0
   * @memberOf itbl
   * @returns {itbl} Returns the `itbl` function.
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


  let itbl = wrap;

  itbl.prototype = _Wrapper.prototype;
  itbl.prototype.constructor = itbl;

  Object.assign(itbl, {
    combine,
    filter,
    isIterable,
    isIterator,
    itbl,
    noConflict,
    map,
    wrap,

 }, EXPOSE_INTERNAL
  ? {
    _wrapIterable,
    _wrapIterator,
    _generateIterable,
    _getIterator,
    _Wrapper,
  }
  : {});

  /*--------------------------------------------------------------------------*/

  // Export itbl.

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
