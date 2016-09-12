# itbl

A collection of javascript utility functions designed to unlock the full potential of [the es6 iterable protocol.](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols) 

The libary will run in es5 environments and supports poly/ponyfilled implementations of iterators.

* [**API Documentation**](tree/master/docs)
* [**View on npm**](https://www.npmjs.com/package/itbl)


## Getting Started

To install with npm

```sh
$ npm install itbl 
```

Then using [Node.js](https://nodejs.org) or [Browserify](http://browserify.org).

```js
// Load the full build.
let itbl = require('itbl');

// Load indevidual methods
var map = require('itbl/map');
var wrap = require('itbl/wrap'); 
```

### Dependancies

The libary current has [lodash](https://lodash.com) as a dependancy. In [Node.js](https://nodejs.org) or [Browserify](http://browserify.org) make sure lodash is installed as a dependancy of your project.

```ah
$ npm install lodash
```




## Built With

* [gulp](http://gulpjs.com)
* [docdown](https://github.com/jdalton/docdown)

## Contributing

Contributions are welcome, style guide has not been written yet but will look very similar to [lodash's contributing guidelines](https://github.com/lodash/lodash/blob/master/.github/CONTRIBUTING.md).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](tags). 

## Authors

* [**Harry Sarson**](https://github.com/HarrySarson) - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* This libary was inspired by [lodash](https://lodash.com) and the documentation style was heavily influenced by the documentation of lodash.
