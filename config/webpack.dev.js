const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, "../dist/"),
        port: 3000,
        publicPath: "http://localhost:3000",
        hotOnly: true,
        open: true
    },
})
