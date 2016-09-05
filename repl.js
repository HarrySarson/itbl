const repl = require('repl');
const lodash = require('lodash');
const itbl = require('./lib');
var msg = 'message';



let printIt = function*() { while(true) { console.log(yield);}  }();
printIt.next();



function* callee() {
    try {
        yield 'b'; // (A)
        yield 'c';
    } finally {
        console.log('finally callee');
    }
}

function* caller() {
    try {
        yield 'a';
        yield* callee();
        yield 'd';
    } catch (e) {
        console.log('[caller] ' + e);
    }
}

let str = require('fs').readFileSync('./lib/wrap.js');

let regex = /(\S*)\s*=\s*require\((['"])((\.\/)?(.*\/)?(.+?))(?:\.js)?\2\)/u;

modifyRegexpFlags = function modifyRegexpFlags(regex, mod) {
  
    if( !lodash.isRegExp(regex) )
      throw new Error('modifyRegexpFlags(regex, mod): regex is not a regex');
  
    var newSrc = regex.source;
    mod = mod || '';
    
    let modSet = new Set(mod.split('')),
        modStr = [...itbl([
            ['global', 'g'],
            ['ignoreCase', 'i'],
            ['multiline', 'm'],
            ['unicode', 'u'],
            ['sticky', 'y'],
          ])
          .filter(  modPair => regex[modPair[0]] || modSet.has(modPair[1]) )
          .map(     modPair => modPair[1] ) 
        ].join('');
      
    return new RegExp(newSrc, modStr);
}

console.log(modifyRegexpFlags(/hi/ui, 'g'));

class RegexIterable {
  
  constructor(regex, str) {
    this._regex = regex;
    this._str = str + '';
  }
  
  *[Symbol.iterator]() {
    
    // clone so that iterators produced are independant of each other
    // and add global flag as this is an iterator
    let regex_clone = modifyRegexpFlags(this._regex, 'g'),
        step;
    
    while( (step = regex_clone.exec(str)) != null )
    {
      yield step;
    }
  }

}

regit = new RegexIterable(regex, str);

repl.start('> ');







