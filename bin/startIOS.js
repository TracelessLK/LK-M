/* eslint-disable no-process-exit */
const {CliUtil} = require('@ys/collection')
const childProcess = require('child_process')
const chalk = require('chalk')
const inquirer = require('inquirer')

const {execSync} = CliUtil
const path = require('path')
const rootDir = path.resolve(__dirname, '../')
const config = require(path.resolve(rootDir, 'config/devConfig'))
const {udid} = config
const verbose = require('debug')('verbose')

start()

async function start () {
  let deviceUdid

  // config in the config file
  if (udid) {
    deviceUdid = udid

  } else {
    const result = childProcess.execSync('instruments -s devices').toString()
    // udid, length 40, like '93ab5ffa6efe55b21d59385bcc782cabcdea5414]'
    let regSrc = '\\n.+\\(.+\\)\\s\\[([a-z]|[0-9]){40}\\]'
    const matchAry = result.match(new RegExp(regSrc, 'g'))

    if (matchAry) {
      const {length} = matchAry
      if (length === 1) {
        deviceUdid = getUdid(matchAry[0])
      } else {
        const question = [{
          type: 'list',
          name: 'udid',
          message: 'Which device to start app development?',
          choices: matchAry,
          filter (val) {
            return getUdid(val)
          }
        }]
        const answer = await inquirer.prompt(question)
        verbose({answer})
        deviceUdid = answer.udid
      }
    } else {
      const warnStr = `No device detected! Please connect your device through USB ` +
        `and trust this computer`
      console.log(chalk.blue(warnStr))
      process.exit(0)
    }
  }
  console.log('starting....')
  const cmd = getCmd(deviceUdid)

  console.log(chalk.green(cmd))
  execSync(cmd)

  console.log('app started successfully')
}

function getCmd (udidParam) {
  return `
react-native run-ios --udid ${udidParam}
`
}

function getUdid (str) {
  const ary = str.match(/\[(([a-z]|[0-9]){40})\]/)

  return ary[1]
}
