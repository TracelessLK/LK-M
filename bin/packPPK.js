const devConfig = require('../config/devConfig')
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil
const clipboardy = require('clipboardy')
const childProcess = require('child_process')


const cmd = `pushy bundle --platform ios --verbose --output ${devConfig.exportPPKFolderPath}/${devConfig.appName}.ppk`

timeCount(() => {
  console.log('ppk export started')
  console.log({cmd})
  childProcess.execSync(cmd)

  console.log('ppk export end')
})

clipboardy.writeSync(cmd)
