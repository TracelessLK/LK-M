/* eslint-disable no-process-exit */
const {CliUtil} = require('@ys/collection')
const childProcess = require('child_process')
const chalk = require('chalk')
const inquirer = require('inquirer')
const verbose = require('debug')('verbose')
const {FuncUtil} = require('@ys/vanilla')

const {execSync} = CliUtil
const config = require('../config/devConfig')

const {udid} = config
const {timeCount} = FuncUtil
const {getAllTarget} = require('./util')

start()

async function start() {
  let deviceUdid

  // config in the config file
  if (udid) {
    deviceUdid = udid
  } else {
    const result = childProcess.execSync('instruments -s devices').toString()
    // udid, length 40, like '93ab5ffa6efe55b21d59385bcc782cabcdea5414'
    const regSrc = '\\n.+\\(.+\\)\\s\\[([a-z]|[0-9]){40}\\]'
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
          filter(val) {
            return getUdid(val)
          }
        }]
        const answer = await inquirer.prompt(question)
        verbose({answer})
        deviceUdid = answer.udid
      }
    } else {
      const warnStr = 'No device detected! Please connect your device through USB '
        + 'and trust this computer'
      console.log(chalk.blue(warnStr))
      process.exit(0)
    }
  }
  const targetAry = getAllTarget().sort((ele) => {
    // LK_dev is default dev scheme
    return !ele.endsWith('dev')
  })
  const questionAry = [
    {
      type: 'list',
      name: 'target',
      message: 'Which target do you want to start?',
      choices: targetAry
    }
  ]
  const answer = await inquirer.prompt(questionAry)
  console.log('starting....')
  const cmd = getCmd(deviceUdid, answer.target)

  console.log(chalk.green(cmd))
  timeCount(() => {
    execSync(cmd)
  })
  console.log('cmd executed successfully')
}

function getCmd(udidParam, target) {
  return `
react-native run-ios --udid ${udidParam} --scheme ${target}
`
}

function getUdid(str) {
  const ary = str.match(/\[(([a-z]|[0-9]){40})]/)

  return ary[1]
}
