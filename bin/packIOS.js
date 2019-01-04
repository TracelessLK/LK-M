const path = require('path')
const rootPath = path.resolve(__dirname, '../')
const fs = require('fs')
const fse = require('fs-extra')
const buildFolderPath = path.resolve(rootPath, 'build')
fse.ensureDirSync(buildFolderPath)
const archivePath = path.resolve(buildFolderPath, 'tmp')
const {argv} = require('yargs')
let {scheme, archive = true, bundle = false} = argv
// console.log(argv, archive)
const schemeAry = []
const devConfig = require('../config/devConfig')
const {appId, serverRoot} = devConfig
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil
const {upload, timeStamp} = require('./util')

timeCount(() => {
  if (!scheme || !schemeAry.includes(scheme)) {
    scheme = appId
  }
  console.log(`scheme : ${scheme}`)
  timeStamp({packType: 'ios'})
  if (bundle) {
    execSync('npm run jsBundle')
  }

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
  const fileName = `${devConfig.appName}.ipa`
  const destination = path.resolve(exportPath, fileName)
  fs.renameSync(path.resolve(exportPath, `${devConfig.appId}.ipa`), destination)

  return upload({
    local: destination,
    remote: path.resolve(serverRoot, `static/public/ios/${fileName}`)
  })
})

function fixFramework () {
  // QBImagePicker bug avoiding
  const frameworkPath = path.resolve(rootPath, `build/tmp.xcarchive/Products/Applications/${appId}.app/Frameworks`)
  fse.removeSync(frameworkPath)
  fse.copySync(path.resolve(rootPath, 'resource/Frameworks'), frameworkPath)
}
