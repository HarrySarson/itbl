const
  _ = require('lodash'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  multistream = require('multistream'),
  readline = require('readline'),
  resolve = require('resolve')
;


function coroutine(generator, ...args) {
  let co = generator(...args);
  co.next();
  return co;
}

let pauseSymb = Symbol('pause');

function watchedStreamSender()
{
  let fileStack = [];
  
  let ss = function(filename, send) {
    let stream = fs.createReadStream(filename);
      
    console.log('push: ' + filename);
    
    fileStack.length !== 0 && _.last(fileStack)[1].pause();
    
    fileStack.push([filename, stream]);
    
    
    (function streamSender(file, send) {
      file[1]
        .on('data', function(chunk) {
          chunk[pauseSymb] = function() {
            console.log('paused? ' + file  + ' !== ' + _.last(fileStack))
            return file !== _.last(fileStack);
          };
          send.next(chunk);
        })
        .on('end', function () {
          let chunk = '\n';
          
          chunk[pauseSymb] = function() {
            return false;
          };
          
          send.next(chunk);
          
          if( send.return )
            send.return();
          
          console.log('pop: ' + fileStack.pop()[0]);
          
          fileStack.length !== 0 && _.last(fileStack)[1].resume(); 
        });
    })(_.last(fileStack), send);
  };
  
  ss.currentFile = function() { return (_.last(fileStack) || [])[0]; }
  return ss;
}


function* streamWriter(writableStream) {
  while(true) {
    let str = (yield) + '';
    writableStream.write(str + '\n');   
  }
}


function* lines(send) {
  
  let line = [''];
  
  while(true) {
    
    let data = yield;
    let str = data + '';
    let lastNl = 0;
        nlIndex = 0;
    
    while( (nlIndex = str.indexOf('\n', lastNl)) !== -1 )
    {
      line.push(str.substr(lastNl, nlIndex - lastNl));
      send.next(_.trim(line.join(''), '\r\n'));
      
      lastNl = nlIndex+1;
      
      line.length = 0;
      
      if( data[pauseSymb]() )
      {
        let data = yield;
        str += data + '';
      }
    }
    
    line.push(str.substr(lastNl));
  } 
}

function filterLines(predicates, send) {
  
  let matches = new Map();
  
  return (function *doFilter() {
  
    while(true) {
      let str = (yield) + '';
      
      if( _(predicates).every(function(predicate) {
        
          let result = predicate(str);

          if( result != null )
          {
            if( matches.get(result.id) == null ) // first occurence
            {
              matches.set(result.id, result);
              
              if( result.allowFirst ) 
                if( result.mapped )
                  result.mapped(coroutine(doFilter));
                else
                  send.next(str);
            }
            else if( result.validate )
              result.validate(matches.get(result.id));
          }
          return !result;
        })
      ) send.next(str);
         
    }
  })();
}

/**
 * Takes the idevidual modules of IteratorUtil and combines them to
 * to make one file.
 *
 * All modules define a function or variable with the same name as the module
 * and all requires store the module in a variable with the same name as the
 * module so it is as simple as copying all modules into one file, and deleting
 * lines involving a require.
 *
 *
 *
 *
 *
 */
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

build();
  
exports.lines = lines;