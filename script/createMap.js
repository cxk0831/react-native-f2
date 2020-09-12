/**
 * 添加路由映射，便于dev调试时快速打开页面
 */

const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const { rootDirectory } = require('../config/config')
const Utils = require('../utils/utils')

async function createDirs() {
    const mapAddress = path.resolve(rootDirectory, './distMap')
    await fs.mkdirSync(mapAddress, {recursive: true})
    await fsExtra.emptyDirSync(mapAddress)
    const fileNameArray = Utils.getPageFileNameArray()
    await Promise.all(fileNameArray.map(async fileNameItem => await fs.mkdirSync(`${mapAddress}/${fileNameItem}`, {recursive: true})))
}

function main() {
    createDirs().catch(e => console.log('文件映射创建失败', e.message))
}

main()
