const path = require('path')
const rootDir = path.resolve(__dirname, '../')
const fs = require('fs')
const {execSync} = require('child_process')

let cmd = ''
const ary = ['yarn.lock', 'node_modules/@ys']

ary.forEach(ele => {
  const elePath = path.resolve(rootDir, ele)

  if (fs.existsSync(elePath)) {
    cmd += `rm -rf ${ele} &&`
  }
})

cmd += 'npm run yarnInstall'

const defaultOption = {
  stdio: [process.stderr, process.stdin, process.stdout]
}

execSync(cmd, defaultOption)
