const fs = require('fs')
const path = require('path')
const { rootDirectory } = require('../config/config')

exports.getPageFileNameArray = () => {
    let pageFileDirs = fs.readdirSync(path.resolve(rootDirectory, './src'), { withFileTypes: true })
    pageFileDirs = pageFileDirs.filter(fileItem => fileItem.isDirectory())
    return pageFileDirs.map(dirItem => dirItem.name)
}
