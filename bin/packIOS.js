const path = require('path')

const rootPath = path.resolve(__dirname, '../')
const fs = require('fs')
const fse = require('fs-extra')
const inquirer = require('inquirer')


const buildFolderPath = path.resolve(rootPath, 'build')
fse.ensureDirSync(buildFolderPath)
const archivePath = path.resolve(buildFolderPath, 'tmp')
const {argv} = require('yargs')

let {scheme} = argv
// console.log(argv, archive)
const schemeAry = []
const {CliUtil} = require('@ys/collection')

const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const devConfig = require('../config/devConfig')

const {appId} = devConfig

const {timeCount} = FuncUtil
const {upload, timeStamp} = require('./util')

start()

async function start() {
  const question = [
    {
      type: 'confirm',
      name: 'shouldBundle',
      message: 'Do you want to bundle app?',
      default: false
    },
    {
      type: 'confirm',
      name: 'shouldArchive',
      message: 'Do you want to archive app?',
      default: true
    },
    {
      type: 'confirm',
      name: 'shouldExportArchive',
      message: 'Do you want to export archived app?',
      default: true
    }
  ]
  const answer = await inquirer.prompt(question)
  const {shouldBundle, shouldArchive, shouldExportArchive} = answer

  timeCount(() => {
    if (!scheme || !schemeAry.includes(scheme)) {
      scheme = appId
    }
    console.log(`scheme : ${scheme}`)
    timeStamp({packType: 'ios'})
    if (shouldBundle) {
      execSync('npm run jsBundle')
    }

    if (shouldArchive) {
      console.log('archive ios ....')
      execSync(`
      cd ios && xcodebuild  -allowProvisioningUpdates  archive -scheme ${scheme} -archivePath "${archivePath}"
    `)
      fixFramework()

      console.log('archive success')
    }

    const exportPath = devConfig.exportIpaFolderPath
    fse.ensureDirSync(exportPath)
    const fileName = `${devConfig.appName}.ipa`
    const destination = path.resolve(exportPath, fileName)
    if (shouldExportArchive) {
      const exportOptionsPath = path.resolve(rootPath, 'ios/ExportOptions.plist')
      execSync(`
    xcodebuild -exportArchive  -allowProvisioningUpdates  -archivePath "${archivePath}.xcarchive" -exportPath "${exportPath}" -exportOptionsPlist '${exportOptionsPath}'
  `)
      console.log('ipa generated successfully')
      fs.renameSync(path.resolve(exportPath, `${devConfig.appId}.ipa`), destination)
    }


    return upload({
      localPath: destination,
      platform: 'ios',
      isPpk: false
    })
  })
}

function fixFramework() {
  // QBImagePicker bug avoiding
  const frameworkPath = path.resolve(rootPath, `build/tmp.xcarchive/Products/Applications/${appId}.app/Frameworks`)
  fse.removeSync(frameworkPath)
  fse.copySync(path.resolve(rootPath, 'resource/Frameworks'), frameworkPath)
}
