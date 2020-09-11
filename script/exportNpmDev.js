const Utils = require('../utils/utils')
const fsExtra = require('fs-extra')
const path = require('path')
const { rootDirectory } = require('../config/config')
const { output } = require('./ouput')
const colors = require('colors-console')
const userConfig = require('../config')

async function main() {
    await Utils.checkBuild()
    await output()
    const projectAddress = await Utils.getProjectAddress()
    let libraryNamePrefix = userConfig.libraryNamePrefix ? `${userConfig.libraryNamePrefix}/`: ''
    const libraryName = await Utils.getLibraryName()
    const libraryNameHump = await Utils.getLibraryNameWithHump()
    const outputAddress = path.resolve(rootDirectory, `./output/${libraryNameHump}`)
    await fsExtra.copy(outputAddress, `${projectAddress}/node_modules/${libraryNamePrefix}${libraryName}`, {filter: (filename) => !filename.includes('package.json')})
    console.log(colors('green','项目输出完毕'))
}

main().catch(e => {console.log('项目输出错误：', e.message)}).finally(() => {process.exit(0)})

