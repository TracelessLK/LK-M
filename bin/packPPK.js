const { FuncUtil } = require('@ys/vanilla')
const inquirer = require('inquirer')
const chalk = require('chalk')

const { timeCount } = FuncUtil
const childProcess = require('child_process')
const path = require('path')
const fse = require('fs-extra')

const config = require('../config/devConfig')

const { exportPPKFolderPath, serverRoot, appName } = config
const fileName = `${appName}.ppk`

const { upload, timeStamp } = require('./util')

start()

async function start() {
  const question = [{
    type: 'list',
    name: 'platform',
    message: 'What platform to pack?',
    choices: ['all', 'ios', 'android']
  },
  {
    type: 'confirm',
    name: 'shouldBundle',
    message: 'Do you want to bundle app?',
    default: true
  }
  ]
  const answer = await inquirer.prompt(question)
  const { platform, shouldBundle} = answer

  timeCount(async () => {
    let platformAry = []
    if (platform !== 'all') {
      platformAry.push(platform)
    } else {
      platformAry = ['ios', 'android']
    }
    // fixme:  'Timed out while waiting for handshake' when run parallel
    for (const ele of platformAry) {
      await generatePpk(ele, shouldBundle)
    }
  }, {
    callback() {
      process.exit()
    }
  })
}

// 根据平台build和上传ppk文件
/*
*  platform, ios 或android
 */
async function generatePpk(platform, shouldBundle) {
  const exportFolder = path.resolve(exportPPKFolderPath, platform)
  fse.ensureDirSync(exportFolder)
  const outputPath = path.resolve(exportFolder, fileName)
  if (shouldBundle) {
    console.log(wrap(platform, 'ppk export started'))

    console.log(wrap(platform, `outputPath: ${outputPath}`))
    const cmd = `npx pushy bundle --platform ${platform} --output ${outputPath}`

    console.log(wrap(platform, `executing: ${cmd}`))
    // fixme: 解决异步的问题
    timeStamp({ packType: 'ppk', platform })
    childProcess.execSync(cmd)
    console.log(wrap(platform, 'ppk export end'))
  }


  await upload({ localPath: outputPath, platform, isPpk: true })
}

// add platform info
function wrap(platform, msg) {
  return `[${chalk.green(platform)}] ${msg}`
}
