

;(function() {
  'use strict';

  /** Do basic error checking */
  const ARGS_CHECK = true;

  /** Expose internal modules for testing */
  const EXPOSE_INTERNAL = true;

  /** check `Symbol`'s are supported */
  if (typeof Symbol === `undefined`) {
    throw new Error('es6 Symbols are required for the itbl libary');
  }

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

  /** Used to access `[Symbol.iterator]` method */
  const iteratorSymbol = Symbol.iterator;

  /**
   * Function that returns the first argument it recieves
   *
   * @private
   * @memberof itbl
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
   *
   * @param {*} value Value to check if function.
   *
   * @returns {boolean} Weather value is function or not.
   * @noexcept
   */
  const _isFunction = value => typeof value === 'function';

  /**
   * @namespace itbl
   */ 
   

  /**
   * @memberof itbl
   * @typedef {{ value: *, done: boolean }} Step
   */

  /**
   * Base class with prototype containing chained itbl methods.
   * This class is returned by `itbl()` and `itbl.wrap()`.
   *
   * @implements Iterable
   * @static
   * @memberof itbl
   * @since 0.1.0
   * @constructor
   * @noexcept
   *
   */
  class _Wrapper {
    /**
     * Create a new Wrapped iterable/iterator.
     *
     * @constructor
     * <!-- replace for docdown -->
     * @since 0.1.0
     *
     * @param {Object} [options = {}]
     * @param {function} [options.next] Method which gets next value of iterator.
     * @param {function} [options.throw] Method which resumes the execution of a generator by throwing an error into it and returns an
     * object with two properties done and value.
     * @param {function} [options.return] Method which returns given value and finishes the iterator.
     * @param {function} [options.[Symbol.iterator]] Method which gets iterator to an iterable.
     *
     */
    constructor({ [iteratorSymbol]: iterMethod, next, throw: thw, return: rtn } = {}) {
      
      // override default [Symbol.iterator] method
      if (iterMethod != null) {
        this[iteratorSymbol] = iterMethod;
      }
      
      if (next != null) {
        this.next = next;
      } 
      
      if (rtn != null) {
        this.return = rtn;
      } 

      if (thw != null) {
        this.throw = thw;
      }      
    }
    
    /**
     * Get an iterator to the wrapped iterable. 
     *
     * By default returns its self but will be overwritten if a
     * [Symbol.iterator] method is passed to the constructor.
     *
     * @function
     * @name itbl._Wrapper#[Symbol.iterator]
     *
     * @since 2.0.0
     * @returns {itbl._Wrapper} Returns a wrapped iterator.
     *
     * @throws Throws if the wrapped value is an iterator or an iterable whose [Symbol.iterator]
     * method throws.
     */
    [iteratorSymbol]() {
      return this;
    }
  }
    
  /**
   * Get the next value of this iterator. 
   *
   * ** This method is only defined if the wrapped value is an iterator. **
   *
   * @function
   * @name itbl._Wrapper#next
   * @since 2.0.0
   *
   * @returns {Step} Returns the next iterator value.
   * @throws Throws if the wrapped iterator's next method throws.
   *
   */
   
     
  /**
   * Returns given value and finishes the iterator.
   *
   * ** This method is only defined if the wrapped value is defines a return method  **
   *
   * @function
   * @name itbl._Wrapper#return
   * @since 2.0.0
   *
   * @param {*} value The value to return
   *
   * @returns {Step} Returns a `{@link Step}` with a value of `value`.
   * @throws Throws if the wrapped iterator's return method throws.
   *
   */

  /**
   * The throw() method resumes the execution of a generator by throwing an error into it and returns an
   * object with two properties done and value.
   *
   * ** This method is only defined if the wrapped value is an iterator **
   *
   * @function
   * @name itbl._Wrapper#throw
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
   * An object is an iterator when it implements a next() method. See {@link 
   * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterator}
   * for more information.
   *
   * @static
   * @memberof itbl
   * @since 0.1.0
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @noexcept
   * @example
   *
   * function MyIterable() { }
   *
   * MyIterable.prototype[Symbol.iterator] = function*() {
   *   while(true) yield 1;
   * };
   *
   * let iterableInstance = new MyIterable();
   *
   * itbl.isIterator(iterableInstance);
   * // => false (this is an iterable but NOT an iterator)
   *
   * // generator function that is then called
   * itbl.isIterator(iterableInstance[Symbol.iterator]());
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
   * In order to be iterable, an object must implement the **@@iterator** method,
   * meaning that the object (or one of the objects up its prototype chain)
   * must have a property with a `[Symbol.iterator]` key which defines a function.
   * (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
   *
   * @static
   * @memberof itbl
   * @since 0.1.0
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @noexcept
   * @example
   *
   *
   * function MyIterable() { }
   *
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
   * @memberof itbl
   * @since 0.1.0
   *
   * @param {Iterator} iterator Iterator to wrap.
   * @param {Object} [methods]
   * @param {function} [methods.next] Replacement `next` method.
   * @param {function} [methods.return] Replacement `return` method.
   * @param {function} [methods.throw] Replacement `throw` method.
   * @param {function} [methods.[Symbol.iterator]] Replacement `[Symbol.iterator]` method.
   *
   * @returns {itbl._Wrapper} Wrapped iterator.
   * @noexcept
   *
   */
  const _wrapIterator = function _wrapIterator(iterator, methods = {}) {
    return new _Wrapper(
      [iteratorSymbol, 'next', 'return', 'throw']
        .map(methodName => [methodName, (methods[methodName] != null ? methods : iterator)[methodName]])
        .reduce((obj, [name, method]) => {
          obj[name] = method != null ? funcBind.call(method, iterator) : null;
          return obj;
        }, {})
    );
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
   * @memberof itbl
   * @since 0.1.0
   
   * @param {Iterable} iterable Iterable to wrap.
   * @param {object} methods
   * @param {function} [methods.next] Replacement `next` method.
   * @param {function} [methods.return] Replacement `return` method.
   * @param {function} [methods.throw] Replacement `throw` method.
   * @param {function} [methods.[Symbol.iterator]] Replacement `[Symbol.iterator]` method.
   *
   * @returns {itbl._Wrapper} Wrapped iterable.
   * @throws Throws `Error` if the objects returned by the `[Symbol.iterator]` method are not iterators.
   *
   */
  const _wrapIterable = function _wrapIterable(iterable, methods) {

    return new _Wrapper({
      [iteratorSymbol]() {
        let iter = iterable[iteratorSymbol]();

        if (ARGS_CHECK && !isIterator(iter)) {
          throw new Error('itbl: `[Symbol.iterator]` method has not returned an iterator');
        }

        return _wrapIterator(iter, methods);
      },
    });
  };

  /**
   * Wraps a generator function to produce a [wrapped iterable]{@link itbl}.
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
   * @memberof itbl
   * @since 0.1.0
   * @param {function} generator A function that returns iterators.
   *
   * @returns {itbl._Wrapper} An iterable.
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
   * @memberof itbl
   * @since 0.1.0
   * @param {Iterable} iterable Iterable to get N iterator to.
   * @param {String} funcName Name of function to blame error on.
   * @param {String} iterableName Name of `iterable` to include in error message;
   *
   * @returns {itbl._Wrapper} An iterator
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

    if (ARGS_CHECK && !isIterable(iterable)) {
      throw new Error(`\`itbl.${funcName}()\`: ${iterableName} is not iterable as the [Symbol.iterator] method not defined).`);
    }
    let iterator = iterable[iteratorSymbol]();

    if (ARGS_CHECK && !isIterator(iterator)) {
      throw new Error(`itbl: ${iterableName} is not iterable as the [Symbol.iterator] method does not return an iterator.`);
    }

    return _wrapIterator(iterator);
  };

  /**
   * Wraps `value` to produce an object that conforms to the
   * iterable protocol and - if `value` is an iterator - the iterator protocol.
   *
   * If `value` is an iterable or an iterator, then `value` will be wrapped in an
   * instance of `itbl`.
   *
   * If `value` is not an iterable, an iterator or a function then `wrap` will throw
   * an exception.
   *
   * If `value` is a function, an iterable instance of `itbl` will be returned.
   * When the `[Symbol.iterator]` method is called,  `value` will be invoked.
   * - If `value` returns an iterator it will be wrapped
   * - If `value` returns an iterable then its
   * `[Symbol.iterator]` method will be called and that iterator wrapped.
   * - If `value` returns any other value (including a function) an exception
   * will be thrown.
   *
   * Therefore all of these are roughly equivalent:
   * ```javascript
   * itbl([6]);
   * itbl(function() { return [6]; });
   * itbl(function() { return [6][Symbol.iterator](); });
   *
   * // this can only be iterated over once, unlike all the above
   * itbl([6][Symbol.iterator]());
   * ```
   *
   * These will raise an exception:
   * <!-- skip-example -->
   * ```javascript
   * itbl(function() { return 6; });
   * itbl(6);
   * ```
   *
   * All itbl functions that take an iterable as their first parameter
   * and return an iterable are chainable and so can be called as methods of the
   * wrapped value.
   *
   * The chainable methods are:
   *
   * `filter` and `map`.
   *
   * @static
   * @since 0.1.0
   * @param {*} value The value to wrap.
   *
   * @returns {itbl._Wrapper} An iterable which may also be an iterator.
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
   * [...mathematicians];
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
  const itbl = function itbl(value) {

    if (value instanceof _Wrapper) {
      return value;
    }

    if (isIterator(value)) {
      return _wrapIterator(value);
    }

    // note iterators may also be iterable but they are treated as iterators
    if (isIterable(value)) {
      return _wrapIterable(value);
    }

    if (_isFunction(value)) {
      return _generateIterable(function() {
        let result = value();

        if (isIterator(value)) {
          return result;
        }

        // get iterator from iterable
        if (isIterable(result)) {
          return result[iteratorSymbol]();
        }

        throw new Error('itbl(): the object returned from value is not an iterable or an iterator');
      });
    }

    throw new Error('itbl(): value is not an iterable, an iterator or a generator function');
  };
  
  const wrap = itbl;
  
  itbl.itbl = itbl.wrap = itbl;
  itbl.prototype = _Wrapper.prototype;
  itbl.prototype.constructor = itbl;

  /**
   * Creates a new iterable whose iterators will have values corresponding to the value
   * of the Iterator of the original iterable run through `iteratee`.
   * The iteratee is invoked with only one argument (value).
   *
   *
   * @static
   * @memberof itbl
   * @since 0.1.0
   * @param {Iterable} iterable Iterable to map values of.
   * @param {Function} [iteratee = _.identity] Function to run each value though.
   *
   * @returns {itbl._Wrapper} `iterable` mapped through `iteratee`, if `iterable` was an iterator then
   * an iterator is returned, otherwise an iterable is returned.
   * @throws {Error} Throws an error if `iterable` is not iterable.
   *
   * @example
   *
   * for(let coor of itbl.map([0, 1, 2, 3, 4, 5], x => ({ x, y: Math.exp(x) }))) {
   *   context.lineTo(coor.x, coor.y);
   * }
   *
   * let mySet = new Set().add(1).add('a').add(NaN);
   *
   * [...itbl.map(mySet, value => value + 1)];
   * // [2, 'a1', NaN]
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' },
   * ];
   *
   * [...itbl.map(users, _.property('user'))];
   * // => ['barney', 'fred']
   *
   */
  const map = function map(iterable, iteratee) {

    iteratee = iteratee != null
      ? iteratee
      : identity;

    if (ARGS_CHECK && !isIterable(iterable)) {
      throw new Error('itbl.map: `iterable` does not define the `[Symbol.iterator]` method');
    }

    return (isIterator(iterable)
      ? _wrapIterator
      : _wrapIterable
    )(iterable, {
      next() {
        const step = this.next();
        let mapped;

        if (!step.done) {
          mapped = iteratee(step.value);
        }

        return {
          value: mapped,
          done: step.done,
        };
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
   * @memberof itbl
   * @since 0.1.0
   * @param {Iterable} iterable Iterable to filter the values of.
   * @param {Function} [predicate = _.identity] Function to run each value though.
   *
   * @returns {itbl._Wrapper} `iterable` filtered using `predicate`, if `iterable` was an iterator then
   * an iterator is returned, otherwise an iterable is returned.
   * @throws {Error} Throws an error if iterators are not supported or the `iterable` is not iterable.
   *
   * @example
   *
   * [...itbl.filter([0,1,2,3,4,5], val => val%2 === 0)];
   * // [0,2,4]
   *
   * let mySet = new Set().add(1).add('a').add(NaN);
   *
   * [...itbl.filter(mySet, value => _.isFinite)];
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

    if (ARGS_CHECK && !isIterable(iterable)) {
      throw new Error('itbl.filter: `iterable` does not define the `[Symbol.iterator]` method');
    }

    return (isIterator(iterable)
            ? _wrapIterator
            : _wrapIterable
    )(iterable, {
      next() {
        let step;

        while (!(step = this.next()).done && !predicate(step.value)) {}

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
   * @memberof itbl
   * @since 0.1.0
   * @param {Iterable} iterable Collection of iterators
   *
   * @returns {itbl._Wrapper} Iterable containing collection of values
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

      for (let step of iterators.map(iterator => iterator.next())) {

        returnValues[i] = step.done ? step.value : returnValues[i];

        values.push(!step.done ? step.value : undefined);

        anyDone = anyDone || step.done;
        allDone = allDone && step.done;

        // TODO don't like having index variable in for-of loop
        ++i;
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
   * @memberof itbl
   * @since 0.1.0
   * @param {Iterable|Object} collection Collection of iterators
   * @param {string} [finish = 'early'] Flag determining when iteration will finish.
   *
   * @returns {itbl._Wrapper} Iterable containing collection of values
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

    switch (finish) {
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

          if ((!finishLate && anyDone) || allDone) {
            if (finishTogether && !allDone) {
              throw new Error("`itbl.combine()`: iterables combined with `finish === 'together'` have not finished together");
            }

            return {
              value: returnValues,
              done: true,
            };
          }

          return {
            value: values,
            done: false,
          };
        },
      };
    });

  };

  /**
   * Combines all `object`'s own enumerable values (which must be iterators) into a single iterable containing objects
   * containing values from each iterable in `object`.
   *
   *
   *
   * @private
   * @static
   * @memberof itbl
   * @since 0.1.0
   * @param {Object} object Collection of iterators
   *
   * @returns {itbl._Wrapper} Iterable containing collection of values.
   * @throws {Error} Throws an error if any own enumerable values of `object` are not enumerable.
   *
   */
  function _objectCombine(object) {

    let iterators = {};

    for (let key of Object.keys(object)) {
      iterators[key] = _getIterator(object[key], 'combine', `\`collection.${key}\` is not an iterator`);
    }
    let returnValues = {};

    return function() {

      let values = {},

          anyDone = false,
          allDone = true;

      for (let key of Object.keys(iterators)) {
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
   * An iterable containing integers from 0 to infinity
   *
   * @type {itbl}
   * @const
   *
   * @example
   *
   * let set = new Set([1, 2, 3, 4, 'iyj', Math]);
   *
   * for (let [value, index] of itbl.combine([set, itbl.indexes])) {
   *   console.log('index: ' + value);
   * }
   *
   */
  const indexes = _generateIterable(function() {
    let i = 0;

    return {
      next() {
        return {
          value: i++,
          done: false,
        };
      },
    };
  });

  /**
   * An iterable containing integers from 1 to infinity
   *
   * @type {itbl}
   * @const
   *
   * @example
   *
   * let squares = itbl.integers.map( i => i*i );
   *
   */
  const integers = _generateIterable(function() {
    let i = 1;

    return {
      next() {
        return {
          value: i++,
          done: false,
        };
      },
    };
  });

  /**
   * Reverts the `itbl` variable to its previous value and returns a reference to
   * the `itbl` function.
   *
   * @static
   * @since 2.0.0
   * @memberof itbl
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
  

  Object.assign(itbl, {
    combine,
    filter,
    indexes,
    integers,
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
