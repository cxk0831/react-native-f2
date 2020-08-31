const path = require("path");
const fs = require('fs')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const pageFileNameArray = fs.readdirSync(path.resolve('./src'))

const createEntryConfig = (fileNameArray) => {
    const configObj = {}
    fileNameArray.forEach(fileName => (configObj[fileName] = path.resolve(`./src/${fileName}/index.tsx`)))
    return configObj
}

const HtmlWebpackPluginArray = pageFileNameArray.map(fileName => new HtmlWebpackPlugin({
    inject: true,
    filename: path.resolve(__dirname, `../dist/${fileName}/index.html`),
    template: path.resolve(__dirname, '../public/index.html')
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
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx"] },
    output: {
        path: path.resolve(__dirname, "../dist/"),
        publicPath: "./",
        filename: "[name]/bundle.js"
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...HtmlWebpackPluginArray
    ]
};
