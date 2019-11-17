const test = require('tape')
const Parser = require('./parser')
const parseEnv = require('.')

test('parseEnv',t=>{
  t.test('parser',t=>{
    let parser 
    t.test('init',t=>{
      parser = Parser()
      t.ok(parser)
      t.end()
    })
    t.test('isValueArray',t=>{
      let result = parser.isValueArray('this,is,an,array')
      t.ok(result)
      result = parser.isValueArray('this_is_not_an_array')
      t.notOk(result)
      t.end()
    })
    t.test('isKeyParsable',t=>{
      let result = parser.isKeyParsable('anything goes')
      t.ok(result)
      result = Parser({prefix:'OS_'}).isKeyParsable('OS_Yes')
      t.ok(result)
      result = Parser({prefix:'OS_'}).isKeyParsable('os_no')
      t.notOk(result)
      result = Parser({regex:'^[a-z0-9]'}).isKeyParsable('yes')
      t.ok(result)
      result = Parser({regex:'^[a-z0-9]'}).isKeyParsable('No')
      t.notOk(result)
      t.end()
    })
    t.test('cleanKey',t=>{
      let result = Parser({prefix:'PARSEENV_'}).parseKey('PARSEENV_hello')
      t.equal(result,'hello')

      result = Parser({prefix:'PARSEENV_'}).parseKey('SEENV_hello')
      t.equal(result,'SEENV_hello')

      result = Parser({prefix:'PARSEENV_'}).parseKey('hello_PARSEENV_')
      t.equal(result,'hello_PARSEENV_')

      result = Parser().parseKey('ok')
      t.equal(result,'ok')
      
      t.end()
    })
    t.test('parseArray',t=>{
      let result = parser.parseArray('one, 2, 3,')
      t.equal(result.length,3)
      t.end()
    })
    t.test('ParseEnv',t=>{
      const parse = parser.parseEnv({
        'a':'1',
        'b':'string',
        'c':'1,2,3',
        'd.e.f.g':'0',
        'e':'a,1',
        '0':'ok',
      })
      t.equal(parse.a,1)
      t.equal(parse.b,'string')
      t.deepEqual(parse.c,[1,2,3])
      t.equal(parse.d.e.f.g,0)
      t.equal(parse[0],'ok')
      t.deepEqual(parse.e,['a',1])
      t.end()
    })
  })
  t.test('parseEnv',t=>{
    const parse = parseEnv({
      'a':'1',
      'b':'string',
      'c':'1,2,3',
      'd.e.f.g':'0',
      'e':'a,1',
      '0':'ok',
    })
    t.equal(parse.a,1)
    t.equal(parse.b,'string')
    t.deepEqual(parse.c,[1,2,3])
    t.equal(parse.d.e.f.g,0)
    t.equal(parse[0],'ok')
    t.deepEqual(parse.e,['a',1])
    t.end()
  })
})
