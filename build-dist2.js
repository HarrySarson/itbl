'use strict';

const _ = require('lodash'),
  Promise = require('bluebird'),
  itbl = require('./lib'),
  fs = Promise.promisifyAll(require('fs')),
  gutil = require('gulp-util'),
  Linkedlist = require('linkedlist'),
  path = require('path'),
  resolve = require('resolve'),
  through = require('through2')
;

const PLUGIN_NAME = 'build-itbl';

function getlinenumber(str, newlinechar) {
  let line = 1,
      col = 1;
      
  newlinechar = newlinechar == null
    ? '\n'
    : newlinechar;
  
  for( let cha of str )
  {
    if( cha === newlinechar )
    {
      linenumber++;
      colnumber = 1;
    }
    else
    {
      colnumber++;
    }
  }
  return {line, col}
}

function modifyRegexpFlags(regex, mod) {
  
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

class ListNode {
  constructor(val) {
    this.value = val;
    this._child = null;
  }
  
  get child() {
    return this._child;
  }
  
  insert_after(listNode) {
        
    let current_child = this._child;
        list = this;
    
    this._child = listNode;
      
    while( list._child != null )
      list = list._child;
        
    return _.set(list, '_child', current_child);
  }
  
  *[Symbol.iterator]() {
      let list = this;
      do
      {
        yield list.value;
      }
      while( list = list.child )
  }
}



/**
 * Takes the indevidual modules of IteratorUtil and combines them to
 * to make one file.
 *
 * All modules define a function or variable with the same name as the module
 * and all requires store the module in a variable with the same name as the
 * module so it is as simple as copying all modules into one file, and deleting
 * lines involving a require.
 *
 * Works as a gulp plugin.
 *
 *
 *
 */
module.exports = function buildItbl(options) {
  
  return through.obj(async function(file, enc, cb) {
    console.log(file);
    try {
      if( file.isNull() ) 
        return cb(null, file);
      
      if( file.isStream() )
        throw new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported');
      
      
      let includePaths = options.includePaths
            ? _.isString(options.includePaths)
              ? [options.includePaths]
              : options.includePaths
            : [];
            

      includePaths.unshift(path.dirname(file.path));
      
      /*
      const parsers = {
        * require: {
            
          iffind: /require(/gu,
             
          let regex = /(\S*)\s*=\s*require\((['"])((\.\/)?(.*\/)?(.+?))(?:\.js)?\2\)/gu,
              match;
          
          while( match = regex.exec(str) )
              yield match; 
        },
        strictmode: {
          find: /use strict/gu,
          * match(str, filepath, rootpath) {
            
            let regex = /^(['"])use strict\1;?$/gu,
                match;
            
            do
            {
              match = regex.exec(str)
              
              match.parse = function() {
                return {
                  str: path.relative(filepath, rootpath) === ''
                    ? null // no change
                    : '',  // remove "'use strict';"
                  from: match.index,
                  to: match.index + match[0].length                
                }
              }
              
              yield match; 
            }
            while( match != null )
          }
        },
        exports: {
          find: /exports/gu,
          * match(str, filepath) {
            let regex = /module.exports\s*=\s*(\w*);?/gu,
                match;
            
            match = regex.exec(str);
            
            if( match != null && match[1] !== path.parse(filepath).name )
            {
              _.assign(match, getlinenumber(str, 0, match.index));
              
              throw new Error(PLUGIN_NAME, + ' ' + match.filepath + ' (' + match.line + ',' + 
                col + '): export of a variable which does not have the same name ' +
                'as the file');
            }
            
            match.parse = function() {
              return {
                str: path.relative(filepath, rootpath) === ''
                  ? null // no change
                  : '',  // remove "exports statement"
                from: match.index,
                to: match.index + match[0].length                
              }
            }
            
            yield match;
            
            if( match = regex.exec(str) )
            {
              _.assign(match, getlinenumber(str, 0, match.index));
              
              throw new Error(PLUGIN_NAME, + ' ' + match.filepath + ' (' + match.line + ',' + 
                col + '): only one export per file allowed');
            }
          }
        }
      };
      */
      const root = file.path;
      let contents = {
        str: file.contents.toString(),
        path: file.path,
        parse_me: true
      };
      
      let testRegExp = {
        require: /require\(/g,
      }
      
      let execRegExp = {
        require: /(\S*)\s*=\s*require\((['"])((\.\/)?(.*\/)?(.+?))(?:\.js)?\2\)/g,
      }
      
      let replacer = {
        require(match, filename) {
          return `// module ${match[1]} from file ${match[3]}`;
        }
      }
      
      let fileStack = [contents];
      
      let rootContents = [];
      
      let arr = (function parse() {
      
        // parse root file
        gutil.log('Parsing file ' + contents.path);
        
        let lastMatchEnd = 0;
        
        let thingToTest = 'require';
        let promiseArray = [];
        
        for( let match of RegexIterable(execRegExp[thingToTest], contents.str) ) 
        {
          let previousStr = contents.str.substring(lastMatchEnd, match.index);
          
          // test string from end of the last match to index of this match
          // and check that there are no occurences of testRegExp.
          if( testRegExp[thingToTest].test(previousStr) )
          {
            
            // find location of invalid occurence of testRegExp
            let invalidMatches = testRegExp[thingToTest].exec(previousStr); 
            
            if( invalidMatches == null )
              // something has gone wrong
              throw new gutil.PluginError(PLUGIN_NAME, 'Unidentified error as testRegExp has failed but no matched found');
            
            let invalidMatch = invalidMatched[0];
            
            let {line, col} = getlinenumber(contents.str.substring(0, invalidMatch.index));
            
            throw new gutil.PluginError(PLUGIN_NAME, 'Invalid ' + thingToTest + ' in file ' + 
              contents.path + ' (' + line + ': ' + col + ')');        
          }
          
          promiseArray.push(previousStr, ...itbl(replacer[thingToTest](match, contents.file)));
        }
        
        return Promise.all(promiseArray);
        
      })();
      
      return cb(await arr.join(''));     
        
    } catch(e) {
      return cb(null, e);
    }  
  });
}
/*
function build() {
  const 
    libDir = './lib/',
    outputFile = './itbl.js',
    files = [ // in order
      'definitions',
      'isIterable',
      'isIterator',
      'Wrapper',
      'NiceIterator',
      'NiceIterable',
      'GeneratedIterable',
      'getIterator',
      'finalValue',
      
      'accumulate',
      'attach',
      'combine',
      'filter',
      'map',
      
      'toArray',
      'wrap',
      'index'
    ]
  ;
    
  let ss = watchedStreamSender();
    
  // multistream(files.map(file => libDir + file + '.js').map(_.ary(fs.createReadStream, 1))
  
  ss(libDir + 'index.js',
    coroutine(lines,
      coroutine(filterLines, 
        [
          str => {
            if( _.includes(str, 'use strict') )
            {
              if( !/^(['"])use strict\1;?$/.test(str) )
              {
                throw new Error("Put 'use strict' on its own line please in " + ss.currentFile());
              }
              else
                return {
                  id: 'use strict',
                  allowFirst: true
                }              
            }
            else return null;
          },
          str => {
            if( _.includes(str, 'require(') )
            {
              let regex = /(\S*)\s*=\s*require\((['"])((\.\/)?(.*\/)?(.+?))(?:\.js)?\2\)/g,
                  result = regex.exec(str);
                  
              if( result == null )
                throw new Error("Require statement: " + str + " is not valid in " + ss.currentFile());
              
              if( regex.test(str) )
                throw new Error("Dont put two require statements in one line in " + ss.currentFile());
              
              if( result[1] !== result[6] )
                console.log('Warning, variable ' + result[1] + ' is not named after the file (' + result[6] + ')' + 
                  ' that it is required from in ' + ss.currentFile());
                
              return {
                id: result[3],
                varName: result[1],
                allowFirst: true,
                validate: previousMatch => {
                    
                    if( previousMatch.varName != result[1] )
                      throw new Error(result[3] + ' is required twice and stored in two different variables: '  + previousMatch.varName + ' and ' + result[1] + ' in ' + ss.currentFile());
                    
                  },
                mapped: result[4]
                  ? filterCo => { // local require, replace with code.
                        
                      let filePath = resolve.sync(result[3], {
                        basedir: libDir
                      });
                      
                      ss(filePath,
                        coroutine(lines,
                          filterCo
                        )
                      ); 
                    }
                  : null, // require from node_modules, leave as is.
              }
            }              
            else return null;            
          }
        ],
        coroutine(streamWriter,fs.createWriteStream(outputFile))
      )
    )
  );
  
  
}

  
exports.lines = lines;

*/