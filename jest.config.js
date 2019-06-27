const path = require('path')

const rootPath = path.resolve(__dirname, '')
const localFolder = path.resolve(rootPath, 'local')
const coverageFolder = path.resolve(localFolder, 'coverage')
const fse = require('fs-extra')

fse.ensureDirSync(localFolder)
fse.ensureDirSync(coverageFolder)

module.exports = {
  bail: true,
  collectCoverage: true,
  coverageDirectory: coverageFolder,
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!react-native|native-base-shoutem-theme|@shoutem/animation|@shoutem/ui|tcomb-form-native|native-base|react-navigation|@ys)'
  ],
  testMatch: [ // 匹配的测试文件
    '<rootDir>/test/**/?(*.)(spec|test).{js,jsx,mjs}',
    '<rootDir>/lk/**/**/__test__/*.test.{js,jsx,mjs}'
  ]
}
