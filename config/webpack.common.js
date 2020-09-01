const path = require("path");
const fs = require('fs')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let pageFileDirs = fs.readdirSync(path.resolve('./src'), { withFileTypes: true })

pageFileDirs = pageFileDirs.filter(fileItem => fileItem.isDirectory())

const pageFileNameArray = pageFileDirs.map(dirItem => dirItem.name)

const createEntryConfig = (pageFileNameArray) => {
    const configObj = {}
    pageFileNameArray.forEach(fileName => (configObj[fileName] = path.resolve(`./src/${fileName}/index.tsx`)))
    return configObj
}

const HtmlWebpackPluginArray = pageFileNameArray.map(fileName => new HtmlWebpackPlugin({
    inject: true,
    filename: path.resolve(__dirname, `../dist/${fileName}/index.html`),
    template: path.resolve(__dirname, '../public/index.html'),
    chunks: [fileName]
}))

module.exports = {
    entry: createEntryConfig(pageFileNameArray),
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    'less-loader'
                ],
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx"] },
    output: {
        path: path.resolve(__dirname, "../dist/"),
        publicPath: "../",
        filename: "[name].js"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            publicPath: "../",
        }),
        new CleanWebpackPlugin(),
        ...HtmlWebpackPluginArray
    ]
};
