'use strict';

var wrap = require('./wrap'),
    definitions = require('./definitions'),
    accumulate = require('./accumulate'),
    attach = require('./attach'),
    combine = require('./combine'),
    filter = require('./filter'),
    finalValue = require('./finalValue'),
    isIterable = require('./isIterable'),
    isIterator = require('./isIterator'),
    map = require('./map'),
    toArray = require('./toArray');
    
var IteratorUtil = wrap;
definitions(IteratorUtil);

IteratorUtil.accumulate = accumulate;
IteratorUtil.attach = attach;
IteratorUtil.combine = combine;
IteratorUtil.filter = filter;
IteratorUtil.finalValue = finalValue;
IteratorUtil.isIterable = isIterable;
IteratorUtil.isIterator = isIterator;
IteratorUtil.map = map;
IteratorUtil.toArray = toArray;

if( module && module.exports )
  module.exports = IteratorUtil; 