const fs = require('fs')
const path = require('path')
const { rootDirectory } = require('../config/config')
const readline = require('readline')
const userConfig = require('../config')
const colors = require('colors-console')

/**
 * 读取src中的项目名
 * @returns {*[]}
 */
getPageFileNameArray = () => {
    let pageFileDirs = fs.readdirSync(path.resolve(rootDirectory, './src'), { withFileTypes: true })
    pageFileDirs = pageFileDirs.filter(fileItem => fileItem.isDirectory())
    return pageFileDirs.map(dirItem => dirItem.name)
}

/**
 * 项目路径输入
 * @returns {Promise<string>}
 */
inputProjectAddress = function() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        rl.question("请输入项目路径:", answer => {
            resolve(answer)
            rl.close()
        })
    })
}

/**
 * 检测地址有效性
 * @returns {Promise<boolean>}
 */
checkProjectAddress = async function (address) {
    try {
        const fileStats = await fs.statSync(`${address}/android`)
        const checkResult = fileStats.isDirectory()
        if(!checkResult){
            throw new Error('android文件夹不存在')
        }
        return true
    } catch (e) {
        console.log(e)
        throw new Error('项目地址错误，请输入本地RN项目的绝对路径')
    }
}

/**
 * 获取主项目地址
 * @returns {Promise<string>}
 */
getProjectAddress = async function () {
    let projectAddress = userConfig.projectAddress
    if(!projectAddress){
        projectAddress = await inputProjectAddress()
    }
    await checkProjectAddress(projectAddress)
    return projectAddress
}

/**
 * 获取项目名
 * @returns {Promise<string|*>}
 */
getLibraryName = async function () {
    let libraryName = userConfig.libraryName
    if(libraryName){
        return libraryName
    }
    const readResult = await fs.readFileSync(path.resolve(rootDirectory, './package.json'), 'utf-8')
    const packageJson = JSON.parse(readResult)
    return packageJson.name
}

/**
 * 获取项目名，并转为驼峰命名
 * @returns {Promise<string>}
 */
getLibraryNameWithHump = async function () {
    let name = await getLibraryName()
    name = name.replace(/^(\w)/, (all, letter) => letter.toUpperCase())
    name = name.replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
    return name
}

/**
 * 字符串替换
 * @param oldString
 * @param newChildString
 * @param oldChildString
 * @returns {*}
 */
replaceString = function (oldString, newChildString, oldChildString) {
    const regExp = oldChildString ? new RegExp(`\\$\\{${oldChildString}?\\}`, 'g') : /\$\{.*?\}/g
    return oldString.replace(regExp, newChildString)
}

/**
 * 检测是否编译
 */
checkBuild = async function() {
    const buildAddress = path.resolve(rootDirectory, './dist')
    try {
        await fs.accessSync(buildAddress)
        return true
    } catch (e) {
        console.log(colors('red','项目未编译, 请先执行build'))
        throw e
    }
}

module.exports = {
    getPageFileNameArray,
    inputProjectAddress,
    getProjectAddress,
    getLibraryName,
    getLibraryNameWithHump,
    replaceString,
    checkBuild
}
