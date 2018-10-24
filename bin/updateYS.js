const {ModuleUtil} = require('@ys/collection')
const {updateYS} = ModuleUtil
const path = require('path')
const rootPath = path.resolve(__dirname, '../')

updateYS(rootPath)
