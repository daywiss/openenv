
const Parser = require('./parser')

module.exports = (env,config={}) =>{
  return Parser(config).parseEnv(env)
}




