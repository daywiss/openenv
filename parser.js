const lodash = require('lodash')

module.exports = (config={}) => {
  let {
    regex,
    prefix='',
    arrayDelimiter=',',
    pathDelimiter='.',
    valueParser=x=>JSON.parse(x),
    keyParser=x=>x.replace(prefix,''),
  } = config

  if(regex) regex = new RegExp(regex)
  if(prefix) prefix = new RegExp(`^${prefix}`)

  function parseValue(value){
    try{
      return valueParser(value)
    }catch(err){
      return value
    }
  }
  
  function parseKey(key){
    try{
      return keyParser(key)
    }catch(err){
      return key
    }
  }

  function isValueArray(value=''){
    return value.toString().includes(arrayDelimiter)
  }

  function isKeyParsable(key){
    if(prefix && !prefix.test(key)) return false
    if(regex) return regex.test(key)
    return true
  }

  function parseArray(value){
    return value
      .split(arrayDelimiter)
      .map(x=>x.trim())
      .filter(x=>x.length)
  }

  function parseEnv(env){
    return lodash.reduce(
      env,
      (result, value, key) => {
        if (!isKeyParsable(key)) return result
        const cleanedKey = parseKey(key)
        const path = cleanedKey.split(pathDelimiter)
        let val = value
        if (isValueArray(value)) {
          val = parseArray(value).map(parseValue)
        }else{
          val = parseValue(value)
        }
        lodash.setWith(result, path, val,Object)
        return result
      },
      {}
    )
  }

  return {
    parseEnv,
    parseArray,
    parseKey,
    parseValue,
    isKeyParsable,
    isValueArray,
    config,
  }

}
