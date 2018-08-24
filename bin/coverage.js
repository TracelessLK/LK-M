const childProcess = require('child_process')
const path = require('path')
const coverage = path.resolve(__dirname, '../local/coverage')
const coverageIndex = path.resolve(coverage, 'lcov-report/index.html')
const fs = require('fs')

if (!fs.existsSync(coverage)) {
  childProcess.execSync(`npm run test`)
}
try {
  childProcess.execSync(`chrome ${coverageIndex}`)
} catch (err) {
  childProcess.execSync(`open ${coverageIndex}`)
}
