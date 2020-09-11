/**
 * 向主项目输出编译后的文件
 * @type {module:fs}
 */

const fs = require('fs')
const path = require('path')
const { rootDirectory } = require('../config/config')
const Utils = require('../utils/utils')
const userConfig = require('../config')

/**
 * 检测此项目中output/{libraryName}是否存在
 * @returns {Promise<boolean>}
 */
async function checkDir() {
    try {
        const libraryName = await Utils.getLibraryNameWithHump()
        await fs.accessSync(path.resolve(rootDirectory, `./output/${libraryName}`))
        return true
    } catch (e) {
        return false
    }
}

/**
 * 依次创建文件夹
 * @returns {Promise<void>}
 */
async function createDir() {
    const libraryName = await Utils.getLibraryNameWithHump()
    const outputAddress = path.resolve(rootDirectory, `./output`)
    const libraryAddress = path.resolve(rootDirectory, `./output/${libraryName}`)
    const buildAddress = path.resolve(rootDirectory, `./output/${libraryName}/build`)
    const libAddress = path.resolve(rootDirectory, `./output/${libraryName}/lib`)
    const RNComponentAddress = path.resolve(rootDirectory, `./output/${libraryName}/RNComponent`)
    await fs.mkdirSync(outputAddress, {recursive: true})
    await fs.mkdirSync(libraryAddress, {recursive: true})
    await fs.mkdirSync(buildAddress, {recursive: true})
    await fs.mkdirSync(libAddress, {recursive: true})
    await fs.mkdirSync(RNComponentAddress, {recursive: true})
}

/**
 * 拷贝HTML模板到output/{libraryName}/lib中
 * @returns {Promise<void>}
 */
async function copyHTMLFile() {
    const libraryName = await Utils.getLibraryNameWithHump()
    const HTMLAddress = path.resolve(rootDirectory, './public/index.html')
    const libAddress = path.resolve(rootDirectory, `./output/${libraryName}/lib`)
    const HTMLBuff = await fs.readFileSync(HTMLAddress)
    await fs.writeFileSync(`${libAddress}/index.html`, HTMLBuff)
}

/**
 * 在output/{libraryName}/RNComponent中，创建文件util.js
 * 此文件用于主项目中调用时创建ReactNative组件
 * @returns {Promise<void>}
 */
async function createUtilFile() {
    const libraryName = await Utils.getLibraryNameWithHump()
    const templateAddress = path.resolve(rootDirectory, './public/RNTemplate/componentFactory.js')
    const RNComponentAddress = path.resolve(rootDirectory, `./output/${libraryName}/RNComponent`)
    let readString = await fs.readFileSync(templateAddress, 'utf8')
    readString = Utils.replaceString(readString, libraryName)
    await fs.writeFileSync(`${RNComponentAddress}/util.js`, readString)
}

/**
 * 在编译后的项目中创建package.json
 * @returns {Promise<void>}
 */
async function createPackageJson() {
    const templateAddress = path.resolve(rootDirectory, './public/RNTemplate/package.json')
    let readString = await fs.readFileSync(templateAddress, 'utf8')
    let libraryName = await Utils.getLibraryName()
    let libraryNameHump = await Utils.getLibraryNameWithHump()
    let libraryNamePrefix = userConfig.libraryNamePrefix ? `${userConfig.libraryNamePrefix}/`: ''
    let projectName = `${libraryNamePrefix}${libraryName}`
    let libraryVersion = userConfig.libraryVersion || '0.0.1'
    readString = Utils.replaceString(readString, projectName, 'libraryName')
    readString = Utils.replaceString(readString, libraryVersion, 'libraryVersion')
    readString = Utils.replaceString(readString, userConfig.libraryDescription)
    const libraryAddress = path.resolve(rootDirectory, `./output/${libraryNameHump}`)
    await fs.writeFileSync(`${libraryAddress}/package.json`, readString)
}

/**
 * 将编译后的js文件，以js字符串的形式导出到output/{libraryName}/build中
 * @param moduleName
 * @returns {Promise<void>}
 */
async function createBuildJs(moduleName) {
    const libraryName = await Utils.getLibraryNameWithHump()
    const moduleAddress = path.resolve(rootDirectory, `./dist/${moduleName}.js`)
    const buildAddress = path.resolve(rootDirectory, `./output/${libraryName}/build`)
    let moduleString = await fs.readFileSync(moduleAddress, 'utf8')
    moduleString = moduleString.replace(/(\'|\\(?!u)|\n)/g, str => "\\" + str)
    await fs.writeFileSync(`${buildAddress}/${moduleName}.js`, `export const ${moduleName} = '${moduleString}'`)
}

/**
 * 为编译后的js文件，在output/{libraryName}/RNComponent中声明为组件
 * @param moduleName
 * @returns {Promise<void>}
 */
async function createBuildComponent(moduleName) {
    const libraryName = await Utils.getLibraryNameWithHump()
    const templateAddress = path.resolve(rootDirectory, './public/RNTemplate/component.js')
    const RNComponentAddress = path.resolve(rootDirectory, `./output/${libraryName}/RNComponent`)
    let readString = await fs.readFileSync(templateAddress, 'utf8')
    readString = Utils.replaceString(readString, moduleName)
    await fs.writeFileSync(`${RNComponentAddress}/${moduleName}.js`, readString)
}

/**
 * 将moduleName注册到output/{libraryName}/RNComponent/index中
 * @param moduleNames
 * @returns {Promise<void>}
 */
async function registerOnIndex(moduleNames) {
    let registerString = moduleNames.reduce((per, cur) => per + `export * from "./${cur}";\n`, '')
    const libraryName = await Utils.getLibraryNameWithHump()
    const RNComponentAddress = path.resolve(rootDirectory, `./output/${libraryName}/RNComponent`)
    await fs.writeFileSync(`${RNComponentAddress}/index.js`, registerString)
}

/**
 * 查看src中的项目
 * @returns {Promise<void>}
 */
async function watchDist() {
    const files = await Utils.getPageFileNameArray()
    const distAddress = path.resolve(rootDirectory, './dist')
    const distFiles = await fs.readdirSync(distAddress)
    if(distFiles.length === 0){
        throw new Error('请先执行build命令')
    }
    return files
}

/**
 * 初始化项目
 * @returns {Promise<void>}
 */
async function initProject() {
    await createDir()
    await copyHTMLFile()
    await createUtilFile()
}

/**
 * 输出js
 * @returns {Promise<void>}
 */
async function outputJS() {
    const files = await watchDist()
    await Promise.all(files.map(async fileItem => {
        await createBuildJs(fileItem)
        await createBuildComponent(fileItem)
    }))
    await registerOnIndex(files)
}

async function output() {
    if(!(await checkDir())){
        await initProject()
    }
    await createPackageJson()
    await outputJS()
}

module.exports = {
    output
}
