const devConfig = require('../config/devConfig')
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil

;(async () => {
  const result = await timeCount(() => {
    console.log('ppk export started')

    execSync(`pushy bundle --platform ios --output ${devConfig.exportPPKFolderPath}/${devConfig.appName}.ppk`)

    console.log('ppk export end')
  })
  console.log(`time elapsed ${result}`)
})()
