const fse = require('fs-extra')
const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')



const localPath = path.resolve(__dirname,'../local')
fse.ensureDirSync(localPath)

childProcess.execSync(`
adb backup -noapk com.traceless
dd if=backup.ab bs=1 skip=24 | python -c "import zlib,sys;sys.stdout.write(zlib.decompress(sys.stdin.read()))" | tar -xvf -
`)
fse.moveSync(path.resolve(__dirname,'../apps'), path.resolve(__dirname,'../local/apps'), { overwrite: true })
fse.remove(path.resolve(__dirname,'../backup.ab'))

childProcess.execSync(`
    open ${path.resolve(__dirname,'../local/apps/com.traceless/db/traceless.db')}
`)

console.log('check local/apps folder')
