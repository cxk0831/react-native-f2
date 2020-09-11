const Utils = require('../utils/utils')
const { output } = require('./ouput')
const childProcess = require('child_process')
const colors = require('colors-console')
const path = require('path')
const {rootDirectory} = require('../config/config')

async function publishNPM() {
    const libraryName = await Utils.getLibraryNameWithHump()
    const libraryAddress = path.resolve(rootDirectory, `./output/${libraryName}`)
    const shellString = `cd ${libraryAddress} && npm publish`
    try {
        await childProcess.execSync(shellString)
    } catch (e) {
        console.log(colors('red', '发布失败'))
    }
}

async function main() {
    await Utils.checkBuild()
    await output()
    await publishNPM()
}

main().catch(e => {console.log('项目输出错误：', e.message)}).finally(() => {process.exit(0)})
