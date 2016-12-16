# <a href="https://harrysarson.github.io/itbl">itbl</a> <span>v2.2.3</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#combinecollection-finishearly">`combine`</a>
* <a href="#filteriterable-predicate_identity">`filter`</a>
* <a href="#isiterablevalue">`isIterable`</a>
* <a href="#itblvalue">`itbl`</a>
* <a href="#itbl_wrapperoptions">`itbl._Wrapper`</a>
* <a href="#itbl_wrapper-[Symbol.iterator]">`itbl._Wrapper#[Symbol.iterator]`</a>
* <a href="#itbl_wrapper-next">`itbl._Wrapper#next`</a>
* <a href="#itbl_wrapper-throwexception">`itbl._Wrapper#throw`</a>
* <a href="#mapiterable-iteratee_identity">`map`</a>
* <a href="#noconflict">`noConflict`</a>

<!-- /div -->

<!-- div -->

## `Properties`
* <a href="#indexes">`indexes`</a>
* <a href="#integers">`integers`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="combinecollection-finishearly"><code>combine(collection, [finish='early'])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L805 "View in source") [&#x24C9;][1]

Combines the iterables in `collection` into a single iterable containing collections
of values from each iterable in `collection`.
<br>
<br>
`collection` can either be an Iterable or an object containing Iterables which
will be combined. The first value in the combined Iterable will be an Iterable or
an object containing the first values of the Iterables in `collection`, the second
value containing the second values of the Iterables in `collection` and so on.
<br>
<br>
The value of `finish` determines when the iteration ends.
<br>
<br>
<br>
* If `finish === 'early' or 'e'` *(default)* then the iteration ends as soon as the first iterator from
`collection` ends.
<br>
<br>
<br>
* If `finish === 'late' or 'l'` then the iteration continues untill all iterators from `collection` are done.
Values corresponding to iterators that have ended are `undefined`.
<br>
<br>
<br>
* If `finish === 'together' or 't'` then all iterators from `collection` must finish on the same iteration or
else an `Error` is thrown.
<br>
<br>
**Note**: The return value of the iterator is a collection of the of the return values the iterators
from `collection`. Return values corresponding to iterators that have not yet ended are `undefined`
<br>
<br>
`combine` is particularly powerful when used with
[es6 destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

#### Since
0.1.0

#### Arguments
1. `collection` *(Iterable|Object)*: Collection of iterators
2. `[finish='early']` *(string)*: Flag determining when iteration will finish.

#### Returns
*(itbl._Wrapper)*: Iterable containing collection of values

#### Example
```js
let mySet = new Set();
mySet.add(1);
mySet.add(Math);

[...itbl.combine([['a','b','c'], mySet, ['alpha','beta', 'gamma']])];
// -> [['a', 1, 'alpha'], ['b', Math, 'beta']]

// with `finish === late`
[...itbl.combine([['a','b','c'], ['alpha','beta', 'gamma'], mySet], 'late')];
// [['a', 1, 'alpha'], ['b', Math, 'beta'], ['c', undefined, 'gamma']]

let coordinates = itbl.combine({
  x: [1,2,3,4,5],
  y: [1,4,9,16,25],
});

for(let coor of coordinates) {
  context.lineTo(coor.x, coor.y);
}

// more concise syntax using object destructuring
for(let {x, y} of coordinates) {
  context.lineTo(x,y);
}
```
---

<!-- /div -->

<!-- div -->

<h3 id="filteriterable-predicate_identity"><code>filter(iterable, [predicate=_.identity])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L666 "View in source") [&#x24C9;][1]

Creates a new iterable containing values which the `predicate` returns truthy for.

#### Since
0.1.0

#### Arguments
1. `iterable` *(Iterable)*: Iterable to filter the values of.
2. `[predicate=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl._Wrapper)*: `iterable` filtered using `predicate`, if `iterable` was an iterator then
an iterator is returned, otherwise an iterable is returned.

#### Example
```js
[...itbl.filter([0,1,2,3,4,5], val => val%2 === 0)];
// [0,2,4]

let mySet = new Set().add(1).add('a').add(NaN);

[...itbl.filter(mySet, value => _.isFinite)];
// [1]

var users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred',   'age': 40, 'active': false }
];

[...itbl.filter(users, function(o) { return !o.active; })];
// => objects for ['fred']

[...itbl.filter(users, _.matches({ 'age': 36, 'active': true }))];
// => objects for ['barney']

[...itbl.filter(users, _.matchesProperty('active', false))];
// => objects for ['fred']

[...itbl.filter(users, _.property('active'))];
// => objects for ['barney']
```
---

<!-- /div -->

<!-- div -->

<h3 id="isiterablevalue"><code>isIterable(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L272 "View in source") [&#x24C9;][1]

Checks if `value` is an iterable object according to es6 iterator protocols.
In order to be iterable, an object must implement the **@@iterator** method,
meaning that the object *(or one of the objects up its prototype chain)*
must have a property with a `[Symbol.iterator]` key which defines a function.
*(https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)*

#### Since
0.1.0

#### Arguments
1. `value` *(&#42;)*: The value to check.

#### Returns
*(boolean)*: Returns `true` if `value` is correctly classified, else `false`.

#### Example
```js
function MyIterable() { }

MyIterable.prototype[Symbol.iterator] = function*(){
  while(true) yield 1;
}

let iterableInstance = new MyIterable();

itbl.isIterable(iterableInstance);
// => true

// generator function that is then called
itbl.isIterable(iterableInstance[Symbol.iterator]());
// => true (this is both an iterator and also iterable)

itbl.isIterable([1, 2, 3]);
// => true

itbl.isIterable({1: 1, 2: 2, 3: 3});
// => false
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblvalue"><code>itbl(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L513 "View in source") [&#x24C9;][1]

Wraps `value` to produce an object that conforms to the
iterable protocol and - if `value` is an iterator - the iterator protocol.
<br>
<br>
If `value` is an iterable or an iterator, then `value` will be wrapped in an
instance of `itbl`.
<br>
<br>
If `value` is not an iterable, an iterator or a function then `wrap` will throw
an exception.
<br>
<br>
If `value` is a function, an iterable instance of `itbl` will be returned.
When the `[Symbol.iterator]` method is called,  `value` will be invoked.
<br>
* If `value` returns an iterator it will be wrapped
<br>
* If `value` returns an iterable then its
`[Symbol.iterator]` method will be called and that iterator wrapped.
<br>
* If `value` returns any other value *(including a function)* an exception
will be thrown.
<br>
<br>
Therefore all of these are roughly equivalent:<br>
```javascript
itbl([6]);
itbl(function() { return [6]; });
itbl(function() { return [6][Symbol.iterator](); });

// this can only be iterated over once, unlike all the above
itbl([6][Symbol.iterator]());
```
<br>
<br>
These will raise an exception:<br>
<!-- skip-example -->
```javascript
itbl(function() { return `6`; });
itbl(6);
```
<br>
<br>
All itbl functions that take an iterable as their first parameter
and return an iterable are chainable and so can be called as methods of the
wrapped value.
<br>
<br>
The chainable methods are:
<br>
<br>
`filter` and `map`.

#### Since
0.1.0

#### Arguments
1. `value` *(&#42;)*: The value to wrap.

#### Returns
*(itbl._Wrapper)*: An iterable which may also be an iterator.

#### Example
```js
let students = [
  {
    name: 'Martin Smith',
    subject: 'Maths',
  },
  {
    name: 'John Arthur',
    subject: 'English',
  },
  {
    name: 'Rachel Richardson',
    subject: 'Maths',
  },
];

// get the name of all maths students
let mathematicians = itbl(students)
 .filter(_.matchesProperty('subject', 'Maths'))
 .map(_.property('name'));

[...mathematicians];
// -> ['Martin Smith', 'Rachel Richardson']

let arr = [1, 7, 8, 9];

let arrayReverse = function arrayReverse(array) {
  return itbl(function* () {
    let i = array.length-1;
    while(i >= 0) {
      yield array[i];
      i--;
    }
  });
};

[...arrayReverse(arr)];
// -> [9, 8, 7, 1]
```
---

<!-- /div -->

<!-- div -->

<h3 id="itbl_wrapperoptions"><code>itbl._Wrapper([options={}])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L109 "View in source") [&#x24C9;][1]

Create a new Wrapped iterable/iterator.

#### Since
0.1.0

#### Arguments
1. `[options={}]` *(Object)*:
2. `[options.next]` *(function)*: Method which gets next value of iterator.
3. `[options.throw]` *(function)*: Method which resumes the execution of a generator by throwing an error into it and returns an
object with two properties done and value.
4. `[options.return]` *(function)*: Method which returns given value and finishes the iterator.
5. `[options.[Symbol.iterator]]` *(function)*: Method which gets iterator to an iterable.

---

<!-- /div -->

<!-- div -->

<h3 id="itbl_wrapper-[Symbol.iterator]"><code>itbl._Wrapper#[Symbol.iterator]()</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L143 "View in source") [&#x24C9;][1]

Get an iterator to the wrapped iterable.
<br>
<br>
By default returns its self but will be overwritten if a
[Symbol.iterator] method is passed to the constructor.

#### Since
2.0.0

#### Returns
*(itbl._Wrapper)*: Returns a wrapped iterator.

---

<!-- /div -->

<!-- div -->

<h3 id="itbl_wrapper-next"><code>itbl._Wrapper#next()</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L160 "View in source") [&#x24C9;][1]

Get the next value of this iterator.
<br>
<br>
** This method is only defined if the wrapped value is an iterator. **

#### Since
2.0.0

#### Returns
*(Step)*: Returns the next iterator value.

---

<!-- /div -->

<!-- div -->

<h3 id="itbl_wrapper-throwexception"><code>itbl._Wrapper#throw(exception)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L195 "View in source") [&#x24C9;][1]

The throw() method resumes the execution of a generator by throwing an error into it and returns an
object with two properties done and value.
<br>
<br>
** This method is only defined if the wrapped value is an iterator **

#### Since
2.0.0

#### Arguments
1. `exception` *(&#42;)*: The exception to throw. For debugging purposes, it is useful to make it an `instanceof
{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error}`.

#### Returns
*(Step)*: Returns the next iterator value.

---

<!-- /div -->

<!-- div -->

<h3 id="mapiterable-iteratee_identity"><code>map(iterable, [iteratee=_.identity])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L590 "View in source") [&#x24C9;][1]

Creates a new iterable whose iterators will have values corresponding to the value
of the Iterator of the original iterable run through `iteratee`.
The iteratee is invoked with only one argument *(value)*.

#### Since
0.1.0

#### Arguments
1. `iterable` *(Iterable)*: Iterable to map values of.
2. `[iteratee=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl._Wrapper)*: `iterable` mapped through `iteratee`, if `iterable` was an iterator then
an iterator is returned, otherwise an iterable is returned.

#### Example
```js
for(let coor of itbl.map([0, 1, 2, 3, 4, 5], x => ({ x, y: Math.exp(x) }))) {
  context.lineTo(coor.x, coor.y);
}

let mySet = new Set().add(1).add('a').add(NaN);

[...itbl.map(mySet, value => value + 1)];
// [2, 'a1', NaN]

var users = [
  { 'user': 'barney' },
  { 'user': 'fred' },
];

[...itbl.map(users, _.property('user'))];
// => ['barney', 'fred']
```
---

<!-- /div -->

<!-- div -->

<h3 id="noconflict"><code>noConflict()</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L974 "View in source") [&#x24C9;][1]

Reverts the `itbl` variable to its previous value and returns a reference to
the `itbl` function.

#### Since
2.0.0

#### Returns
*(itbl)*: Returns the `itbl` function.

#### Example
```js
var IterableUtil = itbl.noConflict();
```
---

<!-- /div -->

<!-- /div -->

<!-- div -->

## `Properties`

<!-- div -->

<h3 id="indexes"><code>indexes</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L925 "View in source") [&#x24C9;][1]

(itbl): An iterable containing integers from `0` to infinity

#### Example
```js
let set = new Set([1, 2, 3, 4, 'iyj', Math]);

for (let [value, index] of itbl.combine([set, itbl.indexes])) {
  console.log('index: ' + value);
}
```
---

<!-- /div -->

<!-- div -->

<h3 id="integers"><code>integers</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/v2.2.3/itbl.js#L949 "View in source") [&#x24C9;][1]

(itbl): An iterable containing integers from `1` to infinity

#### Example
```js
let squares = itbl.integers.map( i => i*i );
```
---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."
