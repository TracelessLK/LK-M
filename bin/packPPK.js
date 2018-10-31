const devConfig = require('../config/devConfig')
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil

timeCount(() => {
  console.log('ppk export started')
  const cmd = `pushy bundle --platform ios --output ${devConfig.exportPPKFolderPath}/${devConfig.appName}.ppk`
  console.log({cmd})
  execSync(cmd)

  console.log('ppk export end')
})
