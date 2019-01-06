const path = require('path')
const rootDir = path.resolve(__dirname, '../')
const fs = require('fs-extra')
const yarnLock = path.resolve(rootDir, 'yarn.lock')
const childProces = require('child_process')
const {execSync} = childProces

if (fs.existsSync(yarnLock)) {
  execSync('rm yarn.lock')
}
execSync(`yarn install && node bin/postinstall`,{
  stdio: [process.stderr, process.stdin, process.stdout]
})
