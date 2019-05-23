const path = require('path')
const fs = require('fs-extra')
const util = require('./util')
const commander = require('commander')
const os = require('os')

let CONFIG_FILE = path.resolve(os.homedir(), '.maliang-config.json')
let OPTIONS = ['env', 'token', 'registry']

async function readConfig () {
  let config
  if (!config) {
    try {
      config = await fs.readJson(CONFIG_FILE)
    } catch (e) {
      config = {token: '', env: ''}
      await fs.writeJson(CONFIG_FILE, config)
    }
  }
  return config
}

async function getConfig (key) {
  let config = await readConfig()
  if (key) return config[key]
  return config
}

async function setConfig (key, val) {
  if (!OPTIONS.includes(key)) {
    util.logRed(`无效配置项 ${key}`)
    process.exit()
  }
  let config = await readConfig()
  if (key && val) {
    config[key] = val
    await fs.writeJson(CONFIG_FILE, config, 'utf-8')
  }
  return config
}

async function start () {
  commander
    .arguments('<key> [val]', '设置或者读取全局配置如`token`、`env`、`host`等')
    .parse(process.argv)

  let configKey = commander.args[0]
  let configVal = commander.args[1]

  let config
  if(!configKey) {
    config = await getConfig()
    return util.log(config)
  }
  if (configKey && !configVal) {
    config = await getConfig(configKey)
    return util.log(config)
  }
  if (configKey && configVal) {
    config = await setConfig(configKey, configVal)
    util.log(config)
  }
}

module.exports = {
  start,
  getConfig,
  setConfig
}