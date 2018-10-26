const path = require('path')
const rootPath = path.resolve(__dirname, '../')
const fs = require('fs')
const fse = require('fs-extra')
const buildFolderPath = path.resolve(rootPath, 'build')
fse.ensureDirSync(buildFolderPath)
const archivePath = path.resolve(buildFolderPath, 'tmp')
const {argv} = require('yargs')
let {scheme, archive = true} = argv
// console.log(argv, archive)
const schemeAry = []
const devConfig = require('../config/devConfig')
const {appId} = devConfig
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil

timeCount(() => {
  if (!scheme || !schemeAry.includes(scheme)) {
    scheme = appId
  }
  console.log(`scheme : ${scheme}`)

  if (archive) {
    console.log('archive ios ....')
    execSync(`
    cd ios && xcodebuild  -allowProvisioningUpdates  archive -scheme ${scheme} -archivePath "${archivePath}"
`)
    console.log('archive success')
  }
  fixFramework()

  const exportPath = devConfig.exportIpaFolderPath
  fse.ensureDirSync(exportPath)

  const exportOptionsPath = path.resolve(rootPath, 'ios/ExportOptions.plist')
  execSync(`
    xcodebuild -exportArchive  -allowProvisioningUpdates  -archivePath "${archivePath}.xcarchive" -exportPath "${exportPath}" -exportOptionsPlist '${exportOptionsPath}'
`)

  console.log('ipa generated successfully')

  fs.renameSync(path.resolve(exportPath, `${devConfig.appId}.ipa`), path.resolve(exportPath, `${devConfig.appName}.ipa`))
})

function fixFramework () {
  // QBImagePicker bug avoiding
  const frameworkPath = path.resolve(archivePath, `Products/Applications/${appId}.app/Frameworks`)
  fse.removeSync(frameworkPath)
  fse.copySync(path.resolve(rootPath, 'resource/Frameworks'), frameworkPath)
}
