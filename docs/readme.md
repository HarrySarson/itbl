# <a href="http://harrysarson.magic.net/">Harry Sarson</a> <span>v1.0.0</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#itblaccumulateiterable-iteratee_identity-initial">`itbl.accumulate`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="itblaccumulateiterable-iteratee_identity-initial"><code>itbl.accumulate(iterable, [iteratee=_.identity], [initial])</code></h3>
[&#x24C8;](https://github.com/HarrySarson/itbl/blob/1.0.0/itbl.js#L74 "View in source") [&#x24C9;][1]

Creates an iterable whose iterators accumulate the values contained in `iterable` as they are<br>
<br>
iterated. The values are the result of running the relevant value of `iterable` through `iteratee`, <br>
<br>
along with the previous value of the accumulated iterator. <br>
<br>
<br>
<br>
If `initial` is not given, the first value of `iterable` is used as the initial value. <br>
<br>
The iteratee is invoked with `2` arguments: *(accumulator, value)*.

#### Since
0.1.0
#### Arguments
1. `iterable` *(Iterable)*: Iterable to reduce values of.
2. `[iteratee=_.identity]` *(Function)*: Function to run each value though.
3. `[initial]` *(&#42;)*: Initial Value

#### Returns
*(&#42;)*: Returns the accumalated value.

#### Example
```js
// uses first value as initial value
[...itbl.accumulate([1, 2, 3, 4], function(sum, n) {
  return sum + n;
})];
// => [1, 3, 6, 10]

let myMap = new Map().set('a', 1).set('b', 2).set('c', 1);

let itbl = itbl.accumulate(myMap, function(result, pair) {
  let arr = result.get(pair[1]);

  if( arr === undefined )
    result.set(pair[1], arr = []);
  
  arr.push(pair[0]);
  return result;
}, new Map());

// or

itbl = itbl.accumulate(myMap.keys(), function(result, key) {
  let value = myMap.get(key),
      arr = result.get(value);

  if( arr === undefined )
    result.set(value, arr = []);
  
  arr.push(key);
  return result;
}, new Map());


let it = itbl[Symbol.iterator];

it.next();
// => `{ value: { '1': ['a'] }, done: false }`
it.next();
//=> `{ value: { '1': ['a'], '2', ['b'] }, done: false }`
it.next();
//=> `{ value:{ '1': ['a', 'c'], '2': ['b'] }, done: false }`
```
---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."
