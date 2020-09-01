/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class InlineChunkHtmlPlugin {
    scriptNameArray
    constructor(htmlWebpackPlugin, tests) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.tests = tests;
        this.scriptNameArray = []
    }

    /**
     * 记录文件名
     * @param scriptName
     */
    recordScriptName(scriptName) {
        this.scriptNameArray.push(scriptName)
    }

    /**
     * 清空文件名
     */
    cleanScriptName() {
        this.scriptNameArray = []
    }

    getInlinedTag(publicPath, assets, tag) {
        console.log('输出2', Object.keys(assets), Object.keys(tag))
        console.log('输出2', tag.tagName)
        if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
            return tag;
        }
        const scriptName = publicPath
            ? tag.attributes.src.replace(publicPath, '')
            : tag.attributes.src;
        if (!this.tests.some(test => scriptName.match(test))) {
            return tag;
        }
        this.recordScriptName(scriptName)
        const asset = assets[scriptName];
        if (asset == null) {
            return tag;
        }
        return {tagName: 'script', innerHTML: asset.source(), closeTag: true};
    }

    apply(compiler) {
        let publicPath = compiler.options.output.publicPath || '';
        if (publicPath && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
            const tagFunction = tag =>
                this.getInlinedTag(publicPath, compilation.assets, tag);

            const hooks = this.htmlWebpackPlugin.getHooks(compilation);
            hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
                assets.headTags = assets.headTags.map(tagFunction);
                assets.bodyTags = assets.bodyTags.map(tagFunction);
            });

            // Still emit the runtime chunk for users who do not use our generated
            // index.html file.
            hooks.afterEmit.tap('InlineChunkHtmlPlugin', param => {
                const chunks = param.plugin.options.chunks
                this.scriptNameArray.forEach(scriptName => {
                    delete compilation.assets[scriptName]
                })
                this.cleanScriptName()
            });
        });
    }
}

module.exports = InlineChunkHtmlPlugin;
