/**
 * 链接主项目
 * 向主项目下的android静态目录（/android/app/src/main/assets）中写入静态html
 */

const fs = require('fs')
const path = require('path')
const { rootDirectory } = require('../config/config')
const Utils = require('../utils/utils')
const colors = require('colors-console')

const PublicHTMLAddress = path.resolve(rootDirectory, './public/index.html')

/**
 * 读取文件夹
 * @returns {Promise<void>}
 */
async function copyFile(address) {
    const fileBuff = await fs.readFileSync(PublicHTMLAddress)
    const baseAddress = `${address}/android/app/src/main/assets`
    const libraryName = await Utils.getLibraryNameWithHump()
    const fileAddress = `${baseAddress}/${libraryName}`
    try {
        await fs.mkdirSync(fileAddress)
    } catch (e) {
        console.info('创建目录异常', e.message)
    }
    await fs.writeFileSync(`${fileAddress}/index.html`, fileBuff)
}

async function main () {
    const address = await Utils.getProjectAddress()
    await copyFile(address)
    console.log(colors('green','初始化成功'))
}

main().catch(e => {console.log('初始化错误：', e.message)}).finally(() => {process.exit(0)})
