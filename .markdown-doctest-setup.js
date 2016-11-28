'use strict';

module.exports = {
  'globals': {
    itbl: require('./itbl.js'),
    _: require('lodash'),
    context: {
      moveTo: function() {},
      lineTo: function() {},
    },
    regeneratorRuntime: require('regenerator-runtime'), // fudge for generator functions in docs
  },
};
