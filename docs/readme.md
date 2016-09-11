# <a href="http://harrysarson.magic.net/">Harry Sarson</a> <span>v1.0.0</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#itblwrapper">`itbl.Wrapper`</a>
* <a href="#itblcombinecollection-finishearly">`itbl.combine`</a>
* <a href="#itblfilteriterable-predicate_identity">`itbl.filter`</a>
* <a href="#itblfinalvalueiterable">`itbl.finalValue`</a>
* <a href="#itblgetiteratoriterable">`itbl.getIterator`</a>
* <a href="#itblisiterablevalue">`itbl.isIterable`</a>
* <a href="#itblisiteratorvalue">`itbl.isIterator`</a>
* <a href="#itblwrapvalue" class="alias">`itbl.itbl` -> `wrap`</a>
* <a href="#itbliteratorsymbol">`itbl.iteratorSymbol`</a>
* <a href="#itblmapiterable-iteratee_identity">`itbl.map`</a>
* <a href="#itblnativeiterators">`itbl.nativeIterators`</a>
* <a href="#itbltoarrayiterable">`itbl.toArray`</a>
* <a href="#itblwrapvalue">`itbl.wrap`</a>
* <a href="#itblwrapiterableiterable">`itbl.wrapIterable`</a>
* <a href="#itblwrapiteratoriterator">`itbl.wrapIterator`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="itblwrapper"><code>itbl.Wrapper()</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L95 "View in source") [&#x24C9;][1]

Base class with prototype containing chained itbl methods.<br>
<br>
This class is returned by `itbl()` and `itbl.wrap()`.

#### Since
0.1.0
---

<!-- /div -->

<!-- div -->

<h3 id="itblcombinecollection-finishearly"><code>itbl.combine(collection, [finish='early'])</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L448 "View in source") [&#x24C9;][1]

Combines the iterables in `collection` into a single iterable containing collections<br>
<br>
of values from each iterable in `collection`.<br>
<br>
<br>
<br>
`collection` can either be an iterable containing iterable values that will be combined<br>
<br>
into an iterable containing iterables containing all the values of the iterable from `collection`<br>
<br>
or an object whose own, enumerable properties are iterables to be combined into an<br>
<br>
iterable containing objects whose own, enumberable properties are the same as `collection`'s<br>
<br>
and the values of those properties will be the values of the iterable from `collection`.<br>
<br>
<br>
<br>
The value of `finish` determines when the iteration ends.<br>
<br>
<br>
<br>
<br>
* If `finish === 'early' or 'e'` *(default)* then the iteration ends as soon as the first iterator from<br>
<br>
`collection` ends.<br>
<br>
<br>
<br>
<br>
* If `finish === 'late' or 'l'` then the iteration continues untill all iterators from `collection` are done.<br>
<br>
Values corresponding to iterators that have ended are `undefined`.<br>
<br>
<br>
<br>
<br>
* If `finish === 'together' or 't'` then all iterators from `collection` must finish on the same iteration or<br>
<br>
else an `Error` is thrown.<br>
<br>
<br>
<br>
**Note**: The return value of the iterator is a collection of the of the return values the iterators<br>
<br>
from `collection`. Return values corresponding to iterators that have not yet ended are `undefined`

#### Since
0.1.0
#### Arguments
1. `collection` *(Object|iterable)*: Collection of iterators
2. `[finish='early']` *(string)*: Flag determining when iteration will finish.

#### Returns
*(itbl.Wrapper)*: Iterable containing collection of values

#### Example
```js
for(let coor of itbl.combine({
  x: [1,2,3,4,5],
  y: [1,4,9,16,25]
})){
  context.lineTo(coor.x, coor.y);
}

let mySet = new Set();
mySet.add(1);
mySet.add(Math);

let iterable = itbl.combine([['a','b','c'], ['alpha','beta', 'gamma'], mySet]);
[...iterable];
// [['a', 'alpha', 1], ['b', 'beta', Math]]
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblfilteriterable-predicate_identity"><code>itbl.filter(iterable, [predicate=_.identity])</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L593 "View in source") [&#x24C9;][1]

Creates a new iterable containing values which the `predicate` returns truthy for.

#### Since
0.1.0
#### Arguments
1. `iterable` *(Iterable)*: Iterable to filter the values of.
2. `[predicate=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl.Wrapper)*: New filtered iterable

#### Example
```js
[...itbl.filter([0,1,2,3,4,5], val => val%2 === 0)]
// [0,2,4]

let mySet = new Set().add(1).add('a').add(NaN)

[...itbl.filter(mySet, value => _.isFinite)]
// [1]

var users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred',   'age': 40, 'active': false }
];

[...itbl.filter(users, function(o) { return !o.active; })];
// => objects for ['fred']

// The `_.matches` iteratee shorthand.
[...itbl.filter(users, { 'age': 36, 'active': true })];
// => objects for ['barney']

// The `_.matchesProperty` iteratee shorthand.
[...itbl.filter(users, ['active', false])];
// => objects for ['fred']

// The `_.property` iteratee shorthand.
[...itbl.filter(users, 'active')];
// => objects for ['barney']
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblfinalvalueiterable"><code>itbl.finalValue(iterable)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L646 "View in source") [&#x24C9;][1]

Gets and iterator from `iterable` and increments an iterator until <br>
<br>
`iterator.next().done === true`. The final value of the iterator is then returned. <br>
<br>
If `iterable` has no values, undefined is returned.

#### Since
0.1.0
#### Arguments
1. `iterable` *(Iterable)*: Iterable to get final value of.

#### Returns
*(&#42;)*: Final value of the iterator.

#### Example
```js
itbl.finalValue([1,2,3,4,5,6,7]);
// => `7` (note much quicker to use _.last)

let mySet = new Set().add(1).add('a').add(NaN)

itbl.finalValue(mySet);
 // => `NaN`
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblgetiteratoriterable"><code>itbl.getIterator([iterable=[]])</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L374 "View in source") [&#x24C9;][1]

Gets iterator from `iterable`. In `es6` environments using default value of `itbl.iteratorSymbol` when<br>
<br>
`iterable` is a valid iterator, this is equivilent to calling `iterable[Symbol.iterator]`. This function includes<br>
<br>
support for different values of `itbl.iteratorSymbol` and helpful error messages.<br>
<br>
<br>
<br>
If `iterable == null` then an 'done' iterator is returned.

#### Since
0.1.0
#### Arguments
1. `[iterable=[]]` *(Iterable)*: Iterable to get iterator to.

#### Returns
*(itbl.Wrapper)*: An iterator

#### Example
```js
let it = itbl.getIterator([1,2,3]);

it.next() // { value: 1, done: false }
it.next() // { value: 2, done: false }
it.next() // { value: 3, done: false }
it.next() // { value: undefined, done: true }
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblisiterablevalue"><code>itbl.isIterable(value)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L229 "View in source") [&#x24C9;][1]

Checks if `value` is an iterable objectaccording to es6 iterator protocols.<br>
<br>
In order to be iterable, an object must implement the @@iterator method,<br>
<br>
meaning that the object *(or one of the objects up its prototype chain)* <br>
<br>
must have a property with a Symbol.iterator key which defines a function.<br>
<br>
*(https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)*

#### Since
0.1.0
#### Arguments
1. `value` *(&#42;)*: The value to check.

#### Returns
*(boolean)*: Returns `true` if `value` is correctly classified,<br>
<br> else `false`.

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

<h3 id="itblisiteratorvalue"><code>itbl.isIterator(value)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L269 "View in source") [&#x24C9;][1]

Checks if `value` is an iterator according to es6 iterator protocols.<br>
<br>
An object is an iterator when it implements a next() method.<br>
<br>
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterator

#### Since
0.1.0
#### Arguments
1. `value` *(&#42;)*: The value to check.

#### Returns
*(boolean)*: Returns `true` if `value` is correctly classified,<br>
<br> else `false`.

#### Example
```js
function MyIterable() { }
MyIterable.prototype[Symbol.iterator] = function*(){
  while(true) yield 1;
}

let iterableInstance = new MyIterable();

itbl.isIterable(iterableInstance);
// => false (this is an iterable but NOT an iterator)

// generator function that is then called
itbl.isIterable(iterableInstance[Symbol.iterator]());
// => true (this is both an iterator and also iterable)

itbl.isIterator([1, 2, 3][Symbol.iterator]());
// => true

for(let i of ['a'])
  itbl.isIterator(i)
// => false (i is equal to 'a')
```
---

<!-- /div -->

<!-- div -->

<h3 id="itbliteratorsymbol"><code>itbl.iteratorSymbol()</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L66 "View in source") [&#x24C9;][1]

Symbol or string used by libary to access iterator method, <br>
<br>
defaults to `es6`'s `Symbol.iterator`.<br>
<br>
Can be overwritten by a symbol or by any non-null value convertable <br>
<br>
to a string to allow polyfilled support for iterators.

#### Since
0.1.0
---

<!-- /div -->

<!-- div -->

<h3 id="itblmapiterable-iteratee_identity"><code>itbl.map(iterable, [iteratee=_.identity])</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L697 "View in source") [&#x24C9;][1]

Creates a new iterable whose iterators will have values coresponding to the value<br>
<br>
of the Iterator of the original iterable run through `iteratee`.<br>
<br>
The iteratee is invoked with only one argument *(value)*.

#### Since
0.1.0
#### Arguments
1. `iterable` *(Iterable)*: Iterable to map values of.
2. `[iteratee=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl.Wrapper)*: A new mapped iterable

#### Example
```js
for(let coor of itbl.map([0,1,2,3,4,5], x => ({ x, y: Math.exp(x)))) {
  context.lineTo(coor.x, coor.y);
}

let mySet = new Set().add(1).add('a').add(NaN)

[...itbl.map(mySet, value => value + 1)]
// [2, 'a1', NaN]

var users = [
  { 'user': 'barney' },
  { 'user': 'fred' }
];

// The `_.property` iteratee shorthand.
[...itbl.map(users, 'user');
// => ['barney', 'fred']
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblnativeiterators"><code>itbl.nativeIterators()</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L38 "View in source") [&#x24C9;][1]

Read only boolean value indicating whether es6 iterators are supported.

#### Since
0.1.0
---

<!-- /div -->

<!-- div -->

<h3 id="itbltoarrayiterable"><code>itbl.toArray(iterable)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L755 "View in source") [&#x24C9;][1]

Iterates over `iterable` and creates an array containing the values contained<br>
<br>
within iterable. Behavour is designed to replicate the `es6` syntax: `[...iterable]`.

#### Since
0.1.0
#### Arguments
1. `iterable` *(Iterable)*: Values to put into array.

#### Returns
*(array)*: Array containing values of `iterable`.

#### Example
```js
function *gen() {
  yield 1;
  yield 2; 
  yield 3; 
}

itbl.toArray(gen());
// [1,2,3]

let mySet = new Set();
mySet.add(1);
mySet.add(Math);

itbl.toArray(mySet);
[1, Math];
```
---

<!-- /div -->

<!-- div -->

<h3 id="itblwrapvalue"><code>itbl.wrap(value)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L307 "View in source") [&#x24C9;][1]

Wraps an iterable, iterator, generator function (any function<br>
<br>
that returns iterators), or a value to produce an objcet that conforms to the<br>
<br>
iterable protocol *(and iterator protocol if `value` is an iterator)*. <br>
<br>
<br>
<br>
If a value is provided that is not an iterable or an iterator, or is a function that does<br>
<br>
not return iterators, it *(or its return value)* is wrapped in an iterable so that `itbl(6)`<br>
<br>
is equivilent to both `itbl(function() { return 6; })` and `itbl([6])`<br>
<br>
<br>
<br>
All itbl functions that take an iterable as their first parameter<br>
<br>
and return an iterable are chainable and so can be called as methods of the<br>
<br>
wrapped value.<br>
<br>
<br>
<br>
The chainable methods are:<br>
<br>
<br>
<br>
`filter` and `map`.<br>
<br>
<br>
<br>
In custom builds, including a function in the build will attach that function<br>
<br>
as a method to all wrapped values.

#### Since
0.1.0
#### Aliases
*itbl.itbl*

#### Arguments
1. `value` *(&#42;)*: The value to wrap.

#### Returns
*(itbl.Wrapper)*: An iterable which may also be an iterator.

---

<!-- /div -->

<!-- div -->

<h3 id="itblwrapiterableiterable"><code>itbl.wrapIterable(iterable)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L150 "View in source") [&#x24C9;][1]

Wraps an iterable, adding chainable itbl methods.<br>
<br>
The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to the iterable protocol.<br>
<br>
<br>
<br>
**Note**: There is no error checking.

#### Since
0.1.0
#### Arguments
1. `iterable` *(iterable)*: Iterable to wrap.

---

<!-- /div -->

<!-- div -->

<h3 id="itblwrapiteratoriterator"><code>itbl.wrapIterator(iterator)</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L117 "View in source") [&#x24C9;][1]

Wraps an iterator, adding chainable itbl methods.<br>
<br>
The `itbl.Wrapper` objects returned by `wrapIterable()` will conform to both the <br>
<br>
iterable protocol and the iterator protocol as well as defining the `return()`<br>
<br>
and `throw()` methods if *(and only if)* `iterator` defines them.<br>
<br>
<br>
<br>
**Note**: There is no error checking.

#### Since
0.1.0
#### Arguments
1. `iterator` *(iterator)*: Iterator to wrap.

---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."
