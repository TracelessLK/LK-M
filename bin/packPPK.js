const {FuncUtil} = require('@ys/vanilla')
const inquirer = require('inquirer')
const {timeCount} = FuncUtil
const childProcess = require('child_process')
const NodeSSH = require('node-ssh')
const ssh = new NodeSSH()
const config = require('../config/devConfig')
const path = require('path')
const {exportPPKFolderPath, serverRoot, appName} = config
const fileName = `${appName}.ppk`
const outputPath = `${exportPPKFolderPath}/${fileName}`
const {upload, timeStamp} = require('./util')

start()

async function start () {
  const question =  [{
    type: 'list',
    name: 'platform',
    message: 'What platform to pack?',
    choices: ['ios', 'android']
  }]
  const answer = await inquirer.prompt(question)
  const {platform} = answer
  const cmd = `npx pushy bundle --platform ${platform} --verbose --output ${outputPath}`

  timeCount(async () => {
    console.log('ppk export started')
    console.log(`outputPath: ${outputPath}`)
    console.log({cmd})
    // fixme: 解决异步的问题
    timeStamp({packType: 'ppk'})
    childProcess.execSync(cmd)

    console.log('ppk export end')
    const option = {
      host: config.ip,
      username: config.sshInfo.username,
      password: config.sshInfo.password
    }
    await ssh.connect(option)
    const remotePath = path.resolve(serverRoot, `static/public/ppk/${fileName}`)
    // console.log(remotePath)

    return upload({local: outputPath, remote: remotePath})
  }, {
    callback () {
      process.exit()
    }
  })
}
