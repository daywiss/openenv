# Open ENV
Use some simple conventions to read process.env into a deeply nested javascript object recognizing
arrays and numbers.

## Install
`yarn add openenv` or `npm install openenv`

## Basic Usage

```js
  //example process.env
  {
    'NODE_ENV':'development',
    'socket.port':'1234',
    'socket.host':'localhost',
    'express.port':'4321'
    'express.host':'localhost',
    'whitelist':'http://example1.com,http://example2.com'
  }

  const config = require('openenv')(process.env)

  //config output
  {
    NODE_ENV:'development',
    //dot notation are interpreted as paths into final objet
    socket:{
      port:1234,       //note numbers try to get parsed as numbers
      host:'localhost',
    },
    express:{
      port:4321,
      host:'localhost',
    },
    //if values have a comma(,) in them, it gets interpreted as an array
    whitelist:['http://example1.com','http://example2.com']
  }

```

## Justification
Its is sometimes necessary for a configuration object to be more complex than what can be represented
in a standard process.env of string:string mappings. This library defines a convention to define keys 
which map to nested paths in an object, as well as rules for parsing arrays and numbers from values.
Advanced configuration allows you to prefix or regex filter unecessary variables from your
final configuation object. If you can follow these conventions in your env then you dont need
any specific env parsing logic in your application, simplifying your app configuration. 

There are many other libraries like this available, the main difference with this one is that you
can configure your delimiters (ex: use '_' instead of '.' for paths), as well as Regex key filtering 
(ex: only parse envs starting with lowercase), map values and other options.

## API

### openenv(process.env,options) => config
```js
const openenv = require('openenv')

//the second object is optional, if not provided it will use default values.
const config = openenv(process.env,{
  //the following are all optional options with defaults shown.

  //specify a regex rule for matching to keys, keys which do 
  //not match are ignored in final output. Regex matches will 
  //not be removed from final key.
  regex:undefined,

  //specify only keys with this prefix to be parsed into the 
  //final config. Prefixes will be removed from the final key.
  prefix:'',
   
  //specify an array delimiter, if seen in the value, 
  //the parser will interpret the value as an array of values.
  arrayDelimiter:','  

  //specify a path delimiter, if seen in a key, the parser will 
  //split the string and interpret the array as a path into the final config.
  pathDelimiter:'.'   

  //all values will run through this parser, before being split for array
  //if an error occurs the raw string is passed instead.
  valueParser:x=>JSON.parse(x)       

  //all keys will pass through this parser, before being split by path
  //by default it will remove the prefix from a matching key.
  keyParser:x=>x.replace(prefix,'')  
})
```
