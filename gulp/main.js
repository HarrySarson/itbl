'use strict';

var wrap = require('../wrap');
var definitions = require('../definitions');
var combine = require('../combine');
var filter = require('../filter');
var finalValue = require('../finalValue');
var isIterable = require('../isIterable');
var isIterator = require('../isIterator');
var map = require('../map');
var toArray = require('../toArray');
    
var itbl = function itbl(value) {
  return wrap(value);
};

definitions(itbl);

itbl.combine = combine;
itbl.filter = filter;
itbl.finalValue = finalValue;
itbl.isIterable = isIterable;
itbl.isIterator = isIterator;
itbl.map = map;
itbl.toArray = toArray;
itbl.itbl = itbl;
itbl.wrap = wrap;


module.exports = itbl;
