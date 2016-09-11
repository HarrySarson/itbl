'use strict';

const _ = require('lodash'),
  Promise = require('bluebird'),
  itbl = require('./main'),
  fs = Promise.promisifyAll(require('fs')),
  gutil = require('gulp-util'),
  path = require('path'),
  resolve = Promise.promisify(require('resolve')),
  through = require('through2'),
  vinylfile = require('vinyl-file');
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
      line++;
      col = 1;
    }
    else
    {
      col++;
    }
  }
  return {line, col}
}

function modifyRegexpFlags(regex, mod) {
  
    if( !_.isRegExp(regex) )
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
    
    let step;
        
    while( (step = this._regex.exec(this._str)) != null )
    {
      yield step;
      
      // run at most one time if not global
      if( !this._regex.global )
        return;
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

let i = 0;

/**
 * Takes the indevidual modules of itbl and combines them to
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
  options = options || {};
  
  let debug = !!options.debug;
  
  let parsers = [
    'require', 
    'strictmode',
    'exports',
  ];
  
  async function ParseFile(file, alreadyIncludedModules, externalModules) {
    
    if( file.isNull() ) 
      return file;
    
    if( file.isStream() )
      throw new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported');
    
    
    const root = file.path;
    
    let contents = {
      str: file.contents.toString(),
      path: file.path
    };
    
    let testRegExp = {
      require: /require\(/,
      strictmode: /use strict/,
      exports: /exports/,
    }
    
    let execRegExp = {
      require: /^var\s*(\S*)\s*=\s*require\((['"])((\.+\/)?((?:.*\/)?(.+?))(?:\.js)?)\2\);?$/gm,
      strictmode: /^(['"])use strict\1;?$/gm,
      exports: /^\s*module.exports\s*=\s*(\w*);?/gm,
    };
    
    let validator = {
      require(match) {
        // variable name must be file path relative to base directory
        // or to node_modules CamelCased
        
        if( match[4] == null )
        {          
          let previousVar = externalModules.get(match[3]);
          let externalRequireValid = previousVar == null     // first reference to this module
            || previousVar === match[1];                     // used the same variable name         
        
          return externalRequireValid;
        }
        
        
        return match[1] === match[5].replace(/\/(.)/g, (match, p1) => _(p1).toUpper());
      },
    };
    
    
    // returns a string or a promise that resolves to a string
    let replacer = {
      async require(match, filename) {
        
        // asyncronously get path to required file
        let filepath = await resolve(match[3], {
          basedir: path.dirname(filename)
        });
        
        // don't load already included modules
        if( alreadyIncludedModules.has(filepath) )
          return debug
            ? `// module ${match[5]} already included\n`
            : '';
            
        alreadyIncludedModules.add(filepath);
        
        // modules from node_modules, replace lodash ones, leave rest as are    
        if( match[4] == null )
        {
          if( !externalModules.get(filepath) )
              externalModules.set(filepath, match[1]);
          
          
          if( match[5].substring(0, 6) === 'lodash' )
            return `var ${match[1]} = _.${match[6]}`;
          
          
          return match[0];
        }
        
        
        
        let filecontents = await vinylfile.read(filepath);
                  
        let newfile = await ParseFile(filecontents, alreadyIncludedModules, externalModules);
        
        return debug
          ? `// start of module ${match[5]}\n`
            + newfile.contents.toString()
            + `\n// end of module ${match[5]}\n`
          : newfile.contents.toString();
      },
      strictmode: _.partial(Promise.resolve, ''),
      exports: _.partial(Promise.resolve, ''),
    };
        
    
    for( let thingToTest of parsers )
    {
      
        
      let lastMatchEnd = 0;
      
      let strArray = [];
      
      if( debug )
      {
        gutil.log('Now parsing: ' + thingToTest + ' in ' + path.relative(file.base, contents.path))
        fs
          .mkdirAsync('./log')
          .catch(function() {})
          .then(function() {
            return fs.writeFileAsync(`./log/${i++}.js`, `// this is file ${contents.path}\n` + contents.str, 'utf8');
          });
      }
        
      for( let match of new RegexIterable(execRegExp[thingToTest], contents.str) ) 
      {
        let previousStr = contents.str.substring(lastMatchEnd, match.index);
        
        // test string from end of the last match to index of this match
        // and check that there are no occurences of testRegExp.
        if( testRegExp[thingToTest] != null && testRegExp[thingToTest].test(previousStr) )
        {
          
          // find location of (first) invalid occurence of testRegExp
          let invalidMatch = testRegExp[thingToTest].exec(previousStr); 
          
          if( invalidMatch == null )
          {
            // something has gone wrong
            throw new gutil.PluginError(PLUGIN_NAME, 'Unidentified error as testRegExp has failed but no matched found when seaching in ' + previousStr);
          }
          
          let {line, col} = getlinenumber(contents.str.substring(0, invalidMatch.index));
          
          throw new gutil.PluginError(PLUGIN_NAME, 'Invalid ' + thingToTest + ' in file ' + 
            contents.path + ' (' + line + ': ' + col + ')');        
        }
        
        // validate
        if( validator[thingToTest] != null && !validator[thingToTest](match) ) {
          
          let {line, col} = getlinenumber(contents.str.substring(0, match.index));
          
          throw new gutil.PluginError(PLUGIN_NAME, 'Invalid ' + thingToTest + ' in file ' + 
            contents.path + ' (' + line + ': ' + col + '). `' + match[0] + '` has failed validation');  
        }
        
        lastMatchEnd = execRegExp[thingToTest].lastIndex;
        
        let replacedString = await replacer[thingToTest](match, contents.path);
        
        
        // we can not move on to next require till this one is done in order to ensure
        // that files are required in the order they appear in the file.
        strArray.push(previousStr, replacedString);
      }
    
      strArray.push(contents.str.substring(lastMatchEnd));
        
          
      contents.str = strArray.join('');
    }
    
    file.contents = Buffer.from(contents.str)
    file.moduleList = alreadyIncludedModules;
    
    
    return file; 
  }
  
  
  return through.obj(function(file, enc, cb) {
    (async function(){
        let newFile = null;
            
        try {
          newFile = await ParseFile(file, new Set(), new Map());
          cb(null, newFile);
        } catch(e) {
          console.log(e);
          cb(e, null);
        }
    })();
  });
}
