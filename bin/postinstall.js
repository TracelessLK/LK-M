const childProcess = require('child_process')
const path = require('path')
const filePath = path.resolve(__dirname,'../node_modules/react-native/local-cli/core/__fixtures__/files/package.json')
const fs = require('fs')

if(fs.existsSync(filePath)){
    childProcess.execSync(`rm ${filePath}`)
}
childProcess.execSync(`npm install --production`,{
    cwd:path.resolve(__dirname,'../common')
})

console.log('npm install finished successfully!')
