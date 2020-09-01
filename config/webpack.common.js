const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { getPageFileNameArray } = require('../utils/utils')
const { rootDirectory } = require('./config')

const createEntryConfig = (pageFileNameArray) => {
    const configObj = {}
    pageFileNameArray.forEach(fileName => (configObj[fileName] = path.resolve(rootDirectory, `./src/${fileName}/index.tsx`)))
    return configObj
}

const pageFileNameArray = getPageFileNameArray()

const HtmlWebpackPluginArray = pageFileNameArray.map(fileName => new HtmlWebpackPlugin({
    inject: true,
    filename: path.resolve(rootDirectory, `./dist/${fileName}/index.html`),
    template: path.resolve(rootDirectory, './public/index.html'),
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
        path: path.resolve(rootDirectory, "./dist/"),
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
