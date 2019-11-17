# Parse ENV
Parse process.env into a deeply nested javascript object using configurable conventions.

## Install
`yarn add parseenv`

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

  const config = require('parseenv')(process.env)

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

## API

### parseEnv(process.env,options) => config
```js
const parseEnv = require('parseenv')

//the second object is optional, if not provided it will use default values.
const config = parseEnv(process.env,{
  //the following are all optional options.
  regex:undefined     //specify a regex rule for matching to keys, keys which do not match are ignored in final output.
  prefix:''           //specify only keys with this prefix to be parsed into the final config. Prefixes will be removed from the final key.
  arrayDelimiter:','  //specify an array delimiter, if seen in the value, the parser will interpret the value as an array of values.
  pathDelimiter:'.'   //specify a path delimiter, if seen in a key, the parser will split the string and interpret the array as a path into the final config.
  valueParser:x=>JSON.parse(x)       //all values will run through this parser, if an error occurs the raw string is passed instead.
  keyParser:x=>x.replace(prefix,'')  //all keys will pass through this parser, by default it will remove the prefix from a matching key.
})
```
