const childProcess = require('child_process')
const path = require('path')
const filePath = path.resolve(__dirname,'../node_modules/react-native/local-cli/core/__fixtures__/files/package.json')
const fs = require('fs')

if(fs.existsSync(filePath)){
    childProcess.execSync(`rm ${filePath}`)
}

console.log('npm install finished successfully!')
