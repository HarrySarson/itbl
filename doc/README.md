# <a href="https://harrysarson.github.io/itbl">itbl</a> <span>v2.1.0</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#itblvalue">`itbl`</a>
* <a href="#itblcombinecollection-finishearly">`itbl.combine`</a>
* <a href="#itblfilteriterable-predicate_identity">`itbl.filter`</a>
* <a href="#itblisiterablevalue">`itbl.isIterable`</a>
* <a href="#itblisiteratorvalue">`itbl.isIterator`</a>
* <a href="#itblmapiterable-iteratee_identity">`itbl.map`</a>
* <a href="#itblnoconflict">`itbl.noConflict`</a>
* <a href="#returnvalue">`return`</a>
* <a href="#itblvalue" class="alias">`wrap` -> `itbl`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="itblvalue"><code>itbl(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L499 "View in source") [&#x24C9;][1]

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
* If `value` returns any other value *(including a function)* an expception
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

#### Aliases
*wrap*

#### Arguments
1. `value` *(&#42;)*: The value to wrap.

#### Returns
*(itbl)*: An iterable which may also be an iterator.

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

<h3 id="itblcombinecollection-finishearly"><code>itbl.combine(collection, [finish='early'])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L783 "View in source") [&#x24C9;][1]

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
*(itbl)*: Iterable containing collection of values

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

<h3 id="itblfilteriterable-predicate_identity"><code>itbl.filter(iterable, [predicate=_.identity])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L644 "View in source") [&#x24C9;][1]

Creates a new iterable containing values which the `predicate` returns truthy for.

#### Since
0.1.0

#### Arguments
1. `iterable` *(Iterable)*: Iterable to filter the values of.
2. `[predicate=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl)*: New filtered iterable

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

<h3 id="itblisiterablevalue"><code>itbl.isIterable(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L228 "View in source") [&#x24C9;][1]

Checks if `value` is an iterable object according to es6 iterator protocols.
In order to be iterable, an object must implement the @@iterator method,
meaning that the object *(or one of the objects up its prototype chain)*
must have a property with a Symbol.iterator key which defines a function.
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

<h3 id="itblisiteratorvalue"><code>itbl.isIterator(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L190 "View in source") [&#x24C9;][1]

Checks if `value` is an iterator according to es6 iterator protocols.
An object is an iterator when it implements a next() method.
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#iterator

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

<h3 id="itblmapiterable-iteratee_identity"><code>itbl.map(iterable, [iteratee=_.identity])</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L569 "View in source") [&#x24C9;][1]

Creates a new iterable whose iterators will have values corresponding to the value
of the Iterator of the original iterable run through `iteratee`.
The iteratee is invoked with only one argument *(value)*.

#### Since
0.1.0

#### Arguments
1. `iterable` *(Iterable)*: Iterable to map values of.
2. `[iteratee=_.identity]` *(Function)*: Function to run each value though.

#### Returns
*(itbl)*: A new mapped iterable

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

<h3 id="itblnoconflict"><code>itbl.noConflict()</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L900 "View in source") [&#x24C9;][1]

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

<!-- div -->

<h3 id="returnvalue"><code>return(value)</code></h3>
[&#x24C8;](https://github.com/harrysarson/itbl/blob/2.1.0/itbl.js#L136 "View in source") [&#x24C9;][1]



#### Since
2.0.0

#### Arguments
1. `value` *(&#42;)*: The value to return

#### Returns
*(Step)*: Returns a `{@link Step}` with a value of `value`.

---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."
