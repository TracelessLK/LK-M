const NodeSSH = require('node-ssh')
const path = require('path')
const inquirer = require('inquirer')
//const chalk = require('chalk')
const childProcess = require('child_process')
const {DateUtil} = require('@ys/vanilla')

const rootDir = path.resolve(__dirname, '..')
const appJSONPath = path.resolve(rootDir, 'lk/app.json')
const iosFolder = path.resolve(rootDir, 'ios')

const {getTimeDisplay} = DateUtil
const fs = require('fs')
const config = require('../config/devConfig')

const {serverRoot, serverHostAry} = config

class util {
  static uploadToRemote({local, remote}) {
    return new Promise(async (resolve) => {
      const question = [
        {
          type: 'list',
          name: 'server',
          message: 'Which server do you want to upload ?',
          choices: serverHostAry.concat('all')
        }
      ]
      const answer = await inquirer.prompt(question)
      const {server} = answer
      let ary = []
      if (server === 'all') {
        ary = ary.concat(serverHostAry)
      } else {
        ary = ary.concat(server)
      }
      ary.forEach(async (ele) => {
        const option = {
          host: ele,
          username: config.sshInfo.username,
          password: config.sshInfo.password
        }
        const ssh = new NodeSSH()
        await ssh.connect(option)
        ssh.putFiles([{local, remote}]).then(() => {
          console.log(`upload ${local} to ${remote} in the server`)
          resolve()
          ssh.dispose()
        },
        (error) => {
          console.log("Something's wrong")
          console.log(error)
          ssh.dispose()
        })
      })
    })
  }

  static async upload({
    localPath, platform, isPpk
  }) {
    const question = [
      {
        type: 'confirm',
        name: 'shouldUpload',
        message: 'Do you want to upload the generated file to your server?',
        default: false
      },
      {
        type: 'list',
        name: 'uploadFolder',
        message: 'Which folder do you want to upload the generated file, public or testing?',
        choices: ['testing', 'public']
      }
    ]
    const answer = await inquirer.prompt(question)
    const {uploadFolder, shouldUpload} = answer
    if (shouldUpload) {
      let remotePath = path.resolve(serverRoot, 'static', uploadFolder)
      if (isPpk) {
        remotePath = path.resolve(remotePath, 'ppk')
      }
      let extension
      if (isPpk) {
        extension = 'ppk'
      } else {
        extension = platform === 'ios' ? 'ipa' : 'apk'
      }
      remotePath = path.resolve(remotePath, platform, `LK.${extension}`)
      await util.uploadToRemote({
        local: localPath,
        remote: remotePath
      })
    }
  }

  static timeStamp(option) {
    const obj = {
      packTime: getTimeDisplay(),
      ...option
    }
    fs.writeFileSync(appJSONPath, JSON.stringify(obj))
  }

  static getAllTarget() {
    let result = []
    const output = childProcess.execSync(`xcodebuild -list`, {
      cwd: iosFolder
    }).toString()
    const regex = /Targets:((?:.|\n)*)Build Configurations:/
    const matchedAry = output.match(regex)
    if (matchedAry) {
      const captured = matchedAry[1]
      result = captured.split('\n').map(ele => ele.trim()).filter(ele => ele)
    }
    return result
  }
}

Object.freeze(util)
module.exports = util
