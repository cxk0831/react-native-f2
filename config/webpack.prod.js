const { merge } = require('webpack-merge')
const common = require('./webpack.common')
// const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const { getPageFileNameArray } = require('../utils/utils')

const pageFileNameArray = getPageFileNameArray()

// const StyleExtHtmlWebpackPluginArray = pageFileNameArray.map(fileName => (
//     new StyleExtHtmlWebpackPlugin({
//         minify: true,
//         chunks: [fileName]
//     })
// ))

module.exports = merge(common, {
    mode: "production",
    plugins: [
        // ...StyleExtHtmlWebpackPluginArray,
        // new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*[.]js/]),
    ]
})
