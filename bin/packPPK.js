const { FuncUtil } = require('@ys/vanilla')
const inquirer = require('inquirer')
const chalk = require('chalk')

const { timeCount } = FuncUtil
const childProcess = require('child_process')
const NodeSSH = require('node-ssh')
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
    name: 'shouldUpload',
    message: 'Do you upload the ppk file to your server?',
    default: false
  }
  ]
  const answer = await inquirer.prompt(question)
  const { platform, shouldUpload} = answer

  timeCount(async () => {
    let platformAry = []
    if (platform !== 'all') {
      platformAry.push(platform)
    } else {
      platformAry = ['ios', 'android']
    }
    // fixme:  'Timed out while waiting for handshake' when run parallel
    for (const ele of platformAry) {
      await generatePpk(ele, shouldUpload)
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
async function generatePpk(platform, shouldUpload) {
  console.log(wrap(platform, 'ppk export started'))
  const exportFolder = path.resolve(exportPPKFolderPath, platform)
  fse.ensureDirSync(exportFolder)
  const outputPath = path.resolve(exportFolder, fileName)
  console.log(wrap(platform, `outputPath: ${outputPath}`))
  const cmd = `npx pushy bundle --platform ${platform} --output ${outputPath}`

  console.log(wrap(platform, `executing: ${cmd}`))
  // fixme: 解决异步的问题
  timeStamp({ packType: 'ppk', platform })
  childProcess.execSync(cmd)
  console.log(wrap(platform, 'ppk export end'))
  const option = {
    host: config.ip,
    username: config.sshInfo.username,
    password: config.sshInfo.password
  }
  const ssh = new NodeSSH()

  await ssh.connect(option)
  const remotePath = path.resolve(serverRoot, `static/public/ppk/${platform}/${fileName}`)
  // console.log(remotePath)
  if (shouldUpload) {
    await upload({ local: outputPath, remote: remotePath })
  }
  ssh.dispose()
}

// add platform info
function wrap(platform, msg) {
  return `[${chalk.green(platform)}] ${msg}`
}
